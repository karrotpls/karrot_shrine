// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function burn(uint256 amount) external;
    function balanceOf(address owner) external view returns (uint256);
}

// ===============================
// KSV DAO + MINTER + GOVERNOR V2
// ===============================
contract RewardMinterV2 {
    // ---- HARD-WIRED TOKENS ----
    address public constant MXDAI = 0x4BecD9DdD5e65b3C14c709fAc4b004aB45D918D4;
    address public constant KARROT = 0x6910076Eee8F4b6ea251B7cCa1052dd744Fc04DA;
    address public constant RABBIT_HOLE = 0xDB75a19203a65Ba93c1baaac777d229bf08452Da;
    address public constant ENTROPY = 0x88B7A62a4Da6e2A7e7680A15F8d2b2f4CDf62732;

    // DAO-Minted token (deployed separately)
    IERC20 public ksvToken;

    // Staking + entropy mapping
    mapping(address => uint256) public karrotStakes;
    mapping(address => uint256) public lastStakeTime;

    // ---- DAO Voting System ----
    enum ProposalState { Active, Passed, Failed, Executed }

    struct Proposal {
        string description;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 deadline;
        ProposalState state;
        function() external executeLogic;
    }

    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    // DAO CONFIG
    uint256 public votingDuration = 3 days;
    uint256 public quorum = 1000 * 1e18; // 1000 KSV

    // ---- EVENTS ----
    event Burned(address indexed user, uint256 amount, uint256 reward);
    event Staked(address indexed user, uint256 amount, uint256 reward);
    event Defended(address indexed user, uint256 amount, uint256 reward);
    event ProposalCreated(uint256 indexed id, string description);
    event ProposalVoted(uint256 indexed id, address voter, bool support);
    event ProposalExecuted(uint256 indexed id);

    constructor(address _ksvToken) {
        ksvToken = IERC20(_ksvToken);
    }

    // ======================
    // ==== REWARD LOOPS ====
    // ======================

    function burnMxDai(uint256 amount) external {
        require(amount > 0, "Nothing to burn");
        IERC20(MXDAI).transferFrom(msg.sender, address(this), amount);
        IERC20(MXDAI).burn(amount);

        uint256 boost = _getEntropyMultiplier(msg.sender);
        uint256 reward = amount * boost / 100;

        IERC20(RABBIT_HOLE).transfer(msg.sender, reward / 2);
        _mintKSV(msg.sender, reward / 2);

        emit Burned(msg.sender, amount, reward);
    }

    function stakeKarrot(uint256 amount) external {
        require(amount > 0, "Zero stake");
        IERC20(KARROT).transferFrom(msg.sender, address(this), amount);

        _harvestStake(msg.sender);

        karrotStakes[msg.sender] += amount;
        lastStakeTime[msg.sender] = block.timestamp;
    }

    function unstakeKarrot(uint256 amount) external {
        require(karrotStakes[msg.sender] >= amount, "Too much unstake");
        _harvestStake(msg.sender);
        karrotStakes[msg.sender] -= amount;
        IERC20(KARROT).transfer(msg.sender, amount);
    }

    function defendPeg(address stableToken, uint256 amount) external {
        require(amount > 0, "Zero defend");
        IERC20(stableToken).transferFrom(msg.sender, address(this), amount);

        uint256 boost = _getEntropyMultiplier(msg.sender);
        uint256 reward = amount * boost / 100;

        IERC20(RABBIT_HOLE).transfer(msg.sender, reward / 2);
        _mintKSV(msg.sender, reward / 2);

        emit Defended(msg.sender, amount, reward);
    }

    function _harvestStake(address user) internal {
        uint256 elapsed = block.timestamp - lastStakeTime[user];
        if (elapsed == 0 || karrotStakes[user] == 0) return;

        uint256 baseReward = karrotStakes[user] * elapsed / 1 days;
        uint256 boost = _getEntropyMultiplier(user);
        uint256 reward = baseReward * boost / 100;

        IERC20(RABBIT_HOLE).transfer(user, reward / 2);
        _mintKSV(user, reward / 2);

        lastStakeTime[user] = block.timestamp;
        emit Staked(user, karrotStakes[user], reward);
    }

    // ======================
    // ==== DAO GOVERNANCE ===
    // ======================

    function createProposal(string memory desc, function() external logic) external {
        require(ksvToken.balanceOf(msg.sender) >= quorum / 10, "Need more KSV to propose");

        proposals[proposalCount] = Proposal({
            description: desc,
            yesVotes: 0,
            noVotes: 0,
            deadline: block.timestamp + votingDuration,
            state: ProposalState.Active,
            executeLogic: logic
        });

        emit ProposalCreated(proposalCount, desc);
        proposalCount++;
    }

    function voteProposal(uint256 id, bool support) external {
        Proposal storage p = proposals[id];
        require(block.timestamp <= p.deadline, "Voting closed");
        require(!hasVoted[id][msg.sender], "Already voted");

        uint256 weight = ksvToken.balanceOf(msg.sender);
        require(weight > 0, "No KSV");

        if (support) p.yesVotes += weight;
        else p.noVotes += weight;

        hasVoted[id][msg.sender] = true;
        emit ProposalVoted(id, msg.sender, support);
    }

    function executeProposal(uint256 id) external {
        Proposal storage p = proposals[id];
        require(block.timestamp > p.deadline, "Too early");
        require(p.state == ProposalState.Active, "Already handled");

        if (p.yesVotes >= quorum && p.yesVotes > p.noVotes) {
            p.state = ProposalState.Executed;
            p.executeLogic();
        } else {
            p.state = ProposalState.Failed;
        }

        emit ProposalExecuted(id);
    }

    // ======================
    // ==== UTILITY ========
    // ======================

    function _getEntropyMultiplier(address user) internal view returns (uint256) {
        uint256 bal = IERC20(ENTROPY).balanceOf(user);
        if (bal >= 1000 ether) return 200;
        if (bal >= 100 ether) return 150;
        if (bal >= 10 ether) return 120;
        return 100;
    }

    function _mintKSV(address to, uint256 amount) internal {
        (bool ok, ) = address(ksvToken).call(
            abi.encodeWithSignature("mint(address,uint256)", to, amount)
        );
        require(ok, "KSV mint failed");
    }

    function getProposal(uint256 id) external view returns (
        string memory desc, uint256 yes, uint256 no, uint256 deadline, ProposalState state
    ) {
        Proposal storage p = proposals[id];
        return (p.description, p.yesVotes, p.noVotes, p.deadline, p.state);
    }
}
