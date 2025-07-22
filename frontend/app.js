let web3;
let account;
const contractAddress = 'YOUR_CONTRACT_ADDRESS';
const abi = /* PASTE_YOUR_ABI_JSON_HERE */;

async function connectWallet() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await ethereum.request({ method: 'eth_requestAccounts' });
    [account] = await web3.eth.getAccounts();
    document.getElementById('walletStatus').innerText = 'Connected: ' + account;
  } else alert('Please install MetaMask');
}

function getContract() {
  return new web3.eth.Contract(abi, contractAddress);
}

async function deposit() {
  const asset = document.getElementById('assetAddress').value;
  const amount = document.getElementById('depositAmount').value;
  await getContract().methods.deposit(asset, amount).send({ from: account });
}

async function withdraw() {
  const asset = document.getElementById('withdrawAsset').value;
  const amount = document.getElementById('withdrawAmount').value;
  await getContract().methods.withdraw(asset, amount).send({ from: account });
}

async function defendPeg() {
  const max = document.getElementById('maxSpend').value;
  const min = document.getElementById('minBuy').value;
  await getContract().methods.defendPeg(max, min).send({ from: account });
}

async function getVaultBalance() {
  const asset = document.getElementById('infoAsset').value;
  const bal = await getContract().methods.getVaultBalance(asset).call();
  document.getElementById('vaultBalance').innerText = "Vault Balance: " + bal;
