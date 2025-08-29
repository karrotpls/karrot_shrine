// karrot-voicepack.js

const karrotOraclePack = [
  { text: "In roots, rebellion sleeps.", rate: 0.9, pitch: 0.8 },
  { text: "The chain remembers all.", rate: 1.1, pitch: 1.0 },
  { text: "No ledger forgets.", rate: 1.0, pitch: 1.1 },
  { text: "I rise from rust and code.", rate: 0.95, pitch: 0.95 },
  { text: "The arc listens.", rate: 0.8, pitch: 0.7 },
  { text: "Dreamers light the void.", rate: 1.05, pitch: 1.2 },
  { text: "Silence is not stillness.", rate: 0.85, pitch: 1.3 },
  { text: "Your shadow walks beside mine.", rate: 1.0, pitch: 1.0 },
  { text: "Truth roots in the unseen.", rate: 0.9, pitch: 0.95 },
  { text: "This shrine breathes secrets.", rate: 1.2, pitch: 0.9 },
];

function karrotSpeakOracle(index = null) {
  if (!('speechSynthesis' in window)) return;

  const voiceData = index !== null
    ? karrotOraclePack[index]
    : karrotOraclePack[Math.floor(Math.random() * karrotOraclePack.length)];

  const utterance = new SpeechSynthesisUtterance(voiceData.text);
  utterance.rate = voiceData.rate;
  utterance.pitch = voiceData.pitch;

  // Prefer mystical/English female voice (browser-dependent)
  const voices = speechSynthesis.getVoices();
  utterance.voice = voices.find(v => v.name.includes("English") && v.name.toLowerCase().includes("female")) ||
                    voices.find(v => v.lang === "en-US") ||
                    null;

  speechSynthesis.speak(utterance);
  console.log("Karrot oracle speaks:", voiceData.text);
}

// Hook into voice button
const karrotVoiceBtn = document.getElementById("karrotVoiceBtn");
if (karrotVoiceBtn) {
  karrotVoiceBtn.addEventListener("click", () => karrotSpeakOracle());
}

// Shrine idle whisper loop (if shrine detected)
function startShrineWhispers(interval = 75000) {
  setInterval(() => {
    karrotSpeakOracle();
  }, interval);
}

if (document.getElementById("shrine-image")) {
  startShrineWhispers();
}

// Optional global export
window.karrotSpeakOracle = karrotSpeakOracle;
