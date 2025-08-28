// 🧠 Karrot Shrine Brain Script (karrot.js)

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
  } else {
    alert('Please install MetaMask');
  }
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
}

// 🕯️ Poe Poem Loading Logic

const poeFilenames = [
  "aDream", "aDreamWithinADream", "acrosticElizabeth", "alAaraaf", "alone", "annabelLee", "bridalBallad",
  "dreamLand", "eldorado", "elizabeth", "enigma", "eulalie", "eveningStar", "fairyLand", "israfel",
  "lenore", "sonnetToScience", "spiritsOfTheDead", "tamerlane", "theBells", "theCityInTheSea",
  "theColiseum", "theConquerorWorm", "theHauntedPalace", "theSleeper", "theraven", "toF",
  "toHelen", "toMLS", "toMyMother", "toScience", "toTheRiver", "ulalume"
];

let loadedPoems = [];

// Load all poems into memory
async function loadAllPoems() {
  const promises = poeFilenames.map(name =>
    fetch(`./Poe/${name}.js`)
      .then(res => res.text())
      .then(code => {
        try {
          const poemModule = {};
          // Isolate the eval into the object (assumes export default string)
          eval(`poemModule.text = ${code.trim().replace(/^export default/, '')}`);
          return poemModule.text;
        } catch (err) {
          console.error(`Failed to parse ${name}.js`, err);
          return '';
        }
      })
  );

  loadedPoems = (await Promise.all(promises)).filter(Boolean);
}

// Utility: get random poem line
function getRandomPoemLine() {
  if (!loadedPoems.length) return "Karrot is still awakening...";
  const poem = loadedPoems[Math.floor(Math.random() * loadedPoems.length)];
  const lines = poem.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  return lines[Math.floor(Math.random() * lines.length)];
}

// 🧠 Karrot AI Response
function getKarrotReply(prompt = "") {
  const tone = /poem|raven|dark|death|night/i.test(prompt) ? "dark" : "light";
  const line = getRandomPoemLine();
  if (tone === "dark") {
    return `🖤 Karrot whispers:\n"${line}"\n...and fades into thought.`;
  } else {
    return `🧠 Karrot muses:\n"${line}"`;
  }
}

// 🎛️ UI Hookups

document.getElementById('karrotBrainBtn').addEventListener('click', (e) => {
  e.preventDefault();
  const input = document.getElementById('karrotUserInput');
  input.value = "";
  document.getElementById('askKarrotModal').classList.remove('hidden');
  setTimeout(() => input.focus(), 50);
});

window.submitKarrotQuestion = function () {
  const userInput = document.getElementById('karrotUserInput').value.trim();
  if (!userInput) return;

  const reply = getKarrotReply(userInput);
  const modalContent = document.getElementById('modalContent');
  modalContent.innerText = reply;

  closeAskModal();
  document.getElementById('contractModal').classList.remove('hidden');
};

window.closeAskModal = function () {
  document.getElementById('askKarrotModal').classList.add('hidden');
};

window.closeModal = function () {
  document.getElementById('contractModal').classList.add('hidden');
  document.getElementById('modalContent').innerText = "";
};

document.getElementById('dropdownButton').addEventListener('click', () => {
  document.getElementById('dropdownMenu').classList.toggle('hidden');
});

document.getElementById('karrotUserInput').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    submitKarrotQuestion();
  }
});

// 🧠 Boot up poem memory
window.addEventListener('DOMContentLoaded', loadAllPoems);
