<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Karrot Shrine DApp</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <h1>🌿 Karrot Shrine Interface</h1>
    <button onclick="connectWallet()">Connect Wallet</button>
    <div id="walletStatus">Not connected</div>

    <h2>Deposit</h2>
    <input id="depositAmount" placeholder="Amount" />
    <input id="assetAddress" placeholder="Token Address" />
    <button onclick="deposit()">Deposit</button>

    <h2>Withdraw</h2>
    <input id="withdrawAmount" placeholder="Amount" />
    <input id="withdrawAsset" placeholder="Token Address" />
    <button onclick="withdraw()">Withdraw</button>

    <h2>Peg Defense</h2>
    <input id="maxSpend" placeholder="Max Spend" />
    <input id="minBuy" placeholder="Min Buy" />
    <button onclick="defendPeg()">Defend Peg</button>

    <h2>Vault Balance</h2>
    <input id="infoAsset" placeholder="Token Address" />
    <button onclick="getVaultBalance()">Get Balance</button>
    <div id="vaultBalance"></div>

    <script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"></script>
    <script src="app.js"></script>
  </body>
</html>

