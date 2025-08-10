// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IVault { 
    function withdrawMxDai(address to, uint256 amt) external; 
}

contract EntropyBurnLoop {
    using SafeERC20 for IERC20;

    IERC20 public immutable entropy1 = IERC20(0x88B7A62a4Da6e2A7e7680A15F8d2b2f4CDf62732);
    IERC20 public immutable entropy2 = IERC20(0xB25D274abd656876A9E325B6995f02A47a81cBEF);
    AggregatorV3Interface public immutable pDaiUsdOracle;
    IVault public immutable vault;
    uint256 public threshold; // e.g. 1e8 for $1, based on feed decimals

    mapping(address => uint256) public deposits;
    event Hypernova(address indexed user, uint256 entropyBurned, uint256 mxDaiReward);

    constructor(address oracle_, address vault_, uint256 threshold_) {
        pDaiUsdOracle = AggregatorV3Interface(oracle_);
        vault = IVault(vault_);
        threshold = threshold_;
    }

    function depositEntropy(uint256 amt1, uint256 amt2) external {
        require(amt1 > 0 || amt2 > 0, "Zero deposit");
        if (amt1 > 0) entropy1.safeTransferFrom(msg.sender, address(this), amt1);
        if (amt2 > 0) entropy2.safeTransferFrom(msg.sender, address(this), amt2);
        deposits[msg.sender] += amt1 + amt2;
        _maybeHypernova(msg.sender);
    }

    function _maybeHypernova(address user) internal {
        uint256 latestPrice = _getPdaiPrice();
        if (latestPrice < threshold) return;

        uint256 burnAmt = deposits[user];
        require(burnAmt > 0, "Nothing to burn");

        deposits[user] = 0;

        uint256 half = burnAmt / 2;
        entropy1.safeTransfer(address(0), half);
        entropy2.safeTransfer(address(0), burnAmt - half);

        vault.withdrawMxDai(user, burnAmt);
        emit Hypernova(user, burnAmt, burnAmt);
    }

    function _getPdaiPrice() internal view returns (uint256 price) {
        (, int256 answer,, uint256 updatedAt,) = pDaiUsdOracle.latestRoundData();
        require(answer > 0 && block.timestamp - updatedAt < 1 hours, "Stale price");
        price = uint256(answer);
    }
}
