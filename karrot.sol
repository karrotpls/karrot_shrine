// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Karrot {
    string public name = "Karrot";
    string public symbol = "KRT";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;

    constructor(uint256 _initialSupply) {
        totalSupply = _initialSupply * (10 ** uint256(decimals));
        balanceOf[msg.sender] = totalSupply;
    }

    function stake(uint256 amount) public {
        require(balanceOf[msg.sender] >= amount, "Not enough tokens to stake.");
        balanceOf[msg.sender] -= amount;
        // Implement staking logic here
    }

    function claim() public {
        // Implement claim logic here
    }
}
