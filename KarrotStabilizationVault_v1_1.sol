// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Karrot Stabilization Vault (KSV) v1.1 - PulseChain Remix-ready Prototype
/// @author Sigma Mother
/// @notice Peg defense, staking prep, and multi-asset vault control

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address owner) external view returns (uint256);
    function burn(uint256 amount) external;
    function decimals() external view returns (uint8);
}

interface IUniswapV2Router {
    function swapExactTokensForTokens(
        uint256 amountIn, uint256 amountOutMin,
        address[] calldata path, address to, uint256 deadline
    ) external returns (uint256[] memory amounts);
}

contract KarrotStabilizationVault {
    address public owner;
    address public governance;
    address public mxDai;
    address public rewardToken;
    address public dexRouter;
    address[] public approvedStablecoins;

    uint256 public minCollateralRatio = 130;
    uint256 public lowCollateralRatio = 120;
    bool public circuitBreaker = false;

    uint256 public lastDefenseBlock;
    uint256 public defenseCooldown = 10; // blocks

    mapping(address => uint256) public vaultBalances;
    mapping(address => uint256) public userRewards;

    bool locked;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyGovernance() {
        require(msg.sender == governance || msg.sender == owner, "Not authorized");
        _;
    }

    modifier notPaused() {
        require(!circuitBreaker, "Paused");
        _;
    }

    modifier noReentrant() {
        require(!locked, "Reentrant");
        locked = true;
        _;
        locked = false;
    }

    event Deposit(address indexed user, address indexed asset, uint256 amount);
    event Withdraw(address indexed user, address indexed asset, uint256 amount);
    event PegDefense(uint256 spent, uint256 bought, uint256 time);
    event RewardsIssued(address indexed user, uint256 reward);
    event CircuitBreakerActivated(uint256 time);
    event ParamChange(string param, uint256 value);

    constructor(address _mxDai, address[] memory _stables, address _router, address _rewardToken) {
        owner = msg.sender;
        governance = msg.sender;
        mxDai = _mxDai;
        rewardToken = _rewardToken;
        dexRouter = _router;
        approvedStablecoins = _stables;
    }

    function deposit(address asset, uint256 amount) external notPaused noReentrant {
        require(isApprovedStablecoin(asset), "Not approved");
        require(IERC20(asset).transferFrom(msg.sender, address(this), amount), "Transfer failed");
        vaultBalances[asset] += amount;

        _issueRewards(msg.sender, amount);

        emit Deposit(msg.sender, asset, amount);
    }

    function withdraw(address asset, uint256 amount) external onlyGovernance noReentrant {
        require(vaultBalances[asset] >= amount, "Insufficient");
        require(IERC20(asset).transfer(msg.sender, amount), "Withdraw failed");
        vaultBalances[asset] -= amount;

        emit Withdraw(msg.sender, asset, amount);
    }

    function defendPeg(
        address tokenToSell,
        uint256 amountIn,
        uint256 amountOutMin
    ) external notPaused noReentrant {
        require(block.number >= lastDefenseBlock + defenseCooldown, "Cooldown active");
        require(vaultBalances[tokenToSell] >= amountIn, "Insufficient vault balance");

        address[] memory path = new address[](2);
        path[0] = tokenToSell;
        path[1] = mxDai;

        IERC20(tokenToSell).transfer(dexRouter, amountIn);

        uint256[] memory amounts = IUniswapV2Router(dexRouter).swapExactTokensForTokens(
            amountIn, amountOutMin, path, address(this), block.timestamp + 60
        );

        uint256 mxDaiBought = amounts[1];
        IERC20(mxDai).burn(mxDaiBought);

        vaultBalances[tokenToSell] -= amountIn;
        vaultBalances[mxDai] -= mxDaiBought;

        lastDefenseBlock = block.number;

        emit PegDefense(amountIn, mxDaiBought, block.timestamp);
    }

    function toggleBreaker() external onlyOwner {
        circuitBreaker = !circuitBreaker;
        emit CircuitBreakerActivated(block.timestamp);
    }

    function setCollateralRatios(uint256 minRatio, uint256 lowRatio) external onlyOwner {
        minCollateralRatio = minRatio;
        lowCollateralRatio = lowRatio;
        emit ParamChange("Collateral", minRatio);
    }

    function setGovernance(address _gov) external onlyOwner {
        governance = _gov;
    }

    function setCooldown(uint256 blocks) external onlyOwner {
        defenseCooldown = blocks;
        emit ParamChange("Cooldown", blocks);
    }

    function _issueRewards(address user, uint256 depositAmt) internal {
        if (rewardToken == address(0)) return;
        uint256 reward = depositAmt / 1000;
        IERC20(rewardToken).transfer(user, reward);
        userRewards[user] += reward;

        emit RewardsIssued(user, reward);
    }

    function isApprovedStablecoin(address asset) public view returns (bool) {
        if (asset == mxDai) return true;
        for (uint256 i = 0; i < approvedStablecoins.length; i++) {
            if (approvedStablecoins[i] == asset) return true;
        }
        return false;
    }

    function getVaultBalance(address asset) public view returns (uint256) {
        return vaultBalances[asset];
    }

    function getApprovedStables() public view returns (address[] memory) {
        return approvedStablecoins;
    }
}
