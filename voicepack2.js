// voicepack.js

// Get available voices
function getAvailableVoices() {
    return new Promise(resolve => {
        let voices = [];
        const synth = window.speechSynthesis;
        if (synth.onvoiceschanged !== undefined) {
            synth.onvoiceschanged = () => {
                voices = synth.getVoices();
                resolve(voices);
            };
        } else {
            voices = synth.getVoices();
            resolve(voices);
        }
    });
}

// Function to get a random Poe riddle MP3 file
function getRandomPoeRiddle() {
    const riddleNumber = Math.floor(Math.random() * 33) + 1; // Random number between 1 and 33
    return `/audio/karrot_voicepack/poe_riddle_${String(riddleNumber).padStart(2, '0')}.mp3`;
}

// Play the selected Poe riddle audio
function playRiddleAudio() {
    const audio = new Audio(getRandomPoeRiddle());
    audio.play();
}

// Function to choose a voice based on the tone
function getVoiceByTone(tone) {
    return getAvailableVoices().then(voices => {
        let selectedVoice;
        if (tone === "dark") {
            // Find male voices (example logic: choosing based on name contains "male")
            selectedVoice = voices.find(v => /male/i.test(v.name));
        } else {
            // Find female voices
            selectedVoice = voices.find(v => /female/i.test(v.name));
        }
        return selectedVoice || voices[0]; // Fallback to default voice
    });
}

// Function to speak a response with the chosen voice and tone
function speak(text, tone) {
    getVoiceByTone(tone).then(voice => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voice;
        utterance.rate = 0.85; // Adjust speed
        utterance.pitch = tone === "dark" ? 0.7 : 1.0; // Adjust pitch
        window.speechSynthesis.speak(utterance);
    });
}

// Function to toggle voice
document.getElementById('voiceToggle').addEventListener('change', function () {
    const tone = this.checked ? "dark" : "light"; // Toggle tone based on switch
    const userInput = document.getElementById('karrotUserInput').value.trim();

    if (userInput) {
        const reply = getKarrotReply(userInput); // Assuming you have this function elsewhere
        document.getElementById('modalContent').innerText = reply;

        if (tone === "dark") {
            playRiddleAudio();  // Play random Poe riddle audio
        }

        speak(reply, tone); // Speak the reply with the appropriate voice
    }
});

// Function to handle submitting a question
window.submitKarrotQuestion = function () {
    const userInput = document.getElementById('karrotUserInput').value.trim();
    if (!userInput) return;

    const tone = /poem|raven|dark|death|night/i.test(userInput) ? "dark" : "light";
    const reply = getKarrotReply(userInput); // This function gets the response based on the user input
    const modalContent = document.getElementById('modalContent');
    modalContent.innerText = reply;

    if (tone === "dark") {
        playRiddleAudio(); // Play Poe riddle for dark tone
    }

    speak(reply, tone); // Speak the response with the correct tone

    closeAskModal(); // Close modal after speaking
    document.getElementById('contractModal').classList.remove('hidden'); // Show contract modal
};
