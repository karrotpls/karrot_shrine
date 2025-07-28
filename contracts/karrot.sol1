// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title Karrot Staking & Governance Contract
/// @author Sigma Mother
/// @notice Enables staking of KSV tokens, reward generation, and basic governance interaction.

interface IERC20 {
    function transfer(address to, uint amount) external returns (bool);
    function transferFrom(address from, address to, uint amount) external returns (bool);
    function balanceOf(address owner) external view returns (uint);
    function approve(address spender, uint amount) external returns (bool);
}

contract Karrot {
    IERC20 public immutable ksvToken;
    address public owner;

    struct Stake {
        uint amount;
        uint timestamp;
        uint rewardDebt;
    }

    mapping(address => Stake) public stakes;
    mapping(address => bool) public admins;

    uint public rewardRatePerSecond = 1e14; // 0.0001 KSV/sec
    uint public totalStaked;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only Sigma Mother");
        _;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender] || msg.sender == owner, "Not authorized");
        _;
    }

    event Staked(address indexed user, uint amount);
    event Unstaked(address indexed user, uint amount, uint reward);
    event RewardUpdated(uint newRate);
    event AdminAdded(address admin);
    event AdminRemoved(address admin);

    constructor(address _ksvToken) {
        ksvToken = IERC20(_ksvToken);
        owner = msg.sender;
    }

    function addAdmin(address admin) external onlyOwner {
        admins[admin] = true;
        emit AdminAdded(admin);
    }

    function removeAdmin(address admin) external onlyOwner {
        admins[admin] = false;
        emit AdminRemoved(admin);
    }

    function updateRewardRate(uint newRate) external onlyAdmin {
        rewardRatePerSecond = newRate;
        emit RewardUpdated(newRate);
    }

    function stake(uint amount) external {
        require(amount > 0, "Amount must be greater than 0");

        Stake storage userStake = stakes[msg.sender];
        _harvest(msg.sender);

        ksvToken.transferFrom(msg.sender, address(this), amount);
        userStake.amount += amount;
        userStake.timestamp = block.timestamp;

        totalStaked += amount;

        emit Staked(msg.sender, amount);
    }

    function unstake(uint amount) external {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.amount >= amount, "Insufficient stake");

        _harvest(msg.sender);
        userStake.amount -= amount;
        ksvToken.transfer(msg.sender, amount);

        totalStaked -= amount;

        emit Unstaked(msg.sender, amount, pendingReward(msg.sender));
    }

    function _harvest(address user) internal {
        uint reward = pendingReward(user);
        if (reward > 0) {
            ksvToken.transfer(user, reward);
        }
        stakes[user].timestamp = block.timestamp;
        stakes[user].rewardDebt = 0;
    }

    function pendingReward(address user) public view returns (uint) {
        Stake memory s = stakes[user];
        if (s.amount == 0) return 0;
        uint elapsed = block.timestamp - s.timestamp;
        return (elapsed * s.amount * rewardRatePerSecond) / 1e18;
    }

    function rescueTokens(address token, uint amount) external onlyOwner {
        require(token != address(ksvToken), "Can't rescue KSV");
        IERC20(token).transfer(owner, amount);
    }

    function emergencyWithdraw() external onlyOwner {
        ksvToken.transfer(owner, ksvToken.balanceOf(address(this)));
    }
}
