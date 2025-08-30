// 🧠 Karrot Shrine VoicePack Logic (voicepack.js)

// Define male and female voices for each poem
const voices = {
  male: {
    aDream: "https://link_to_male_voice_sample_aDream.mp3",
    fallback: "https://link_to_male_voice_sample_fallback.mp3"
  },
  female: {
    aDream: "https://link_to_female_voice_sample_aDream.mp3",
    fallback: "https://link_to_female_voice_sample_fallback.mp3"
  }
};

// Function to select the appropriate voice based on user preference (toggle)
function getVoiceLine(poemName, isMale) {
  // Default to male if not specified
  const voiceGender = isMale ? 'male' : 'female';
  
  if (voices[voiceGender] && voices[voiceGender][poemName]) {
    return voices[voiceGender][poemName];
  }
  
  // Fallback line if poem voice isn't found
  return voices[voiceGender].fallback;
}

// Function to load and play the correct voice
function playVoice(poemName, isMale) {
  const voiceUrl = getVoiceLine(poemName, isMale);
  const audio = new Audio(voiceUrl);
  audio.play();
}

// Example usage (User selects the voice type via toggle)
const isMale = document.getElementById('voiceToggle').checked;
playVoice('aDream', isMale); // Play the selected poem's voice
