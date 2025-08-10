// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title KSVGovernanceToken - DAO Voting + Reward Token for Karrot Stabilization Vault System
/// @author Sigma
/// @notice Mintable governance token controlled by RewardMinterV2

contract KSVGovernanceToken {
    string public constant name = "Karrot Stabilization Vault Governance";
    string public constant symbol = "KSV";
    uint8 public constant decimals = 18;

    uint256 public totalSupply;

    address public immutable rewardMinter;

    mapping(address => uint256) private balances;
    mapping(address => mapping(address => uint256)) private allowances;

    // === EIP-712 Voting Logic ===
    mapping(address => address) public delegates;
    mapping(address => uint256) public nonces;
    mapping(address => uint256) public votePower;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event DelegateChanged(address indexed delegator, address indexed fromDelegate, address indexed toDelegate);
    event VotePowerUpdated(address indexed delegate, uint256 newPower);

    modifier onlyMinter() {
        require(msg.sender == rewardMinter, "Not minter");
        _;
    }

    constructor(address _rewardMinter) {
        rewardMinter = _rewardMinter;
    }

    // ===== ERC-20 BASIC =====

    function balanceOf(address account) public view returns (uint256) {
        return balances[account];
    }

    function transfer(address to, uint256 amount) public returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function allowance(address owner, address spender) public view returns (uint256) {
        return allowances[owner][spender];
    }

    function transferFrom(address from, address to, uint256 amount) public returns (bool) {
        require(allowances[from][msg.sender] >= amount, "Allowance exceeded");
        allowances[from][msg.sender] -= amount;
        _transfer(from, to, amount);
        return true;
    }

    // ===== TRANSFER LOGIC =====

    function _transfer(address from, address to, uint256 amount) internal {
        require(balances[from] >= amount, "Insufficient");
        balances[from] -= amount;
        balances[to] += amount;

        _moveVotes(delegates[from], delegates[to], amount);
        emit Transfer(from, to, amount);
    }

    // ===== MINTING =====

    function mint(address to, uint256 amount) external onlyMinter {
        totalSupply += amount;
        balances[to] += amount;
        _moveVotes(address(0), delegates[to], amount);
        emit Transfer(address(0), to, amount);
    }

    // ===== DELEGATION =====

    function delegate(address to) external {
        address prev = delegates[msg.sender];
        delegates[msg.sender] = to;

        uint256 balance = balances[msg.sender];
        _moveVotes(prev, to, balance);

        emit DelegateChanged(msg.sender, prev, to);
    }

    function _moveVotes(address from, address to, uint256 amount) internal {
        if (from != to && amount > 0) {
            if (from != address(0)) {
                votePower[from] -= amount;
                emit VotePowerUpdated(from, votePower[from]);
            }
            if (to != address(0)) {
                votePower[to] += amount;
                emit VotePowerUpdated(to, votePower[to]);
            }
        }
    }

    function getVotes(address account) external view returns (uint256) {
        return votePower[account];
    }
}
