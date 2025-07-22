// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Karrot Shrine Staking Contract (v0.1 Beta)
/// @dev Placeholder staking contract until full Shrine staking flywheel is implemented

contract StakingContract {
    mapping(address => uint256) public staked;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);

    function stake() external payable {
        require(msg.value > 0, "Zero stake");
        staked[msg.sender] += msg.value;
        emit Staked(msg.sender, msg.value);
    }

    function unstake(uint256 amount) external {
        require(staked[msg.sender] >= amount, "Insufficient stake");
        staked[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Unstaked(msg.sender, amount);
    }
}
