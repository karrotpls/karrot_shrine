// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IERC20.sol";
import "./RewardMinterV2.sol";

contract VaultStabilizerV2 {
    IERC20 public mxDai;
    IERC20 public stableToken;
    RewardMinterV2 public rewardMinter;

    address public operator;
    bool public isPaused;

    modifier onlyOperator() {
        require(msg.sender == operator, "Not operator");
        _;
    }

    modifier notPaused() {
        require(!isPaused, "Vault paused");
        _;
    }

    constructor(address _mxDai, address _stableToken, address _rewardMinter) {
        mxDai = IERC20(_mxDai);
        stableToken = IERC20(_stableToken);
        rewardMinter = RewardMinterV2(_rewardMinter);
        operator = msg.sender;
    }

    function depositStable(uint256 amount) external notPaused {
        require(stableToken.transferFrom(msg.sender, address(this), amount), "Deposit failed");
        rewardMinter.defendPeg(address(stableToken), amount);
    }

    function emergencyWithdraw(address token, uint256 amount) external onlyOperator {
        require(IERC20(token).transfer(operator, amount), "Withdraw failed");
    }

    function pause(bool _paused) external onlyOperator {
        isPaused = _paused;
    }

    function updateOperator(address newOperator) external onlyOperator {
        operator = newOperator;
    }
}
