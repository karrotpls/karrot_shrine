import { loadedPoems } from './poePoemsLoader.js';

// 🕯️ Static fallback Poe lines for use when dynamic loading fails or for blend mode
const fallbackLines = [
  "Once upon a midnight dreary, while I pondered, weak and weary...",
  "Deep into that darkness peering, long I stood there wondering, fearing...",
  "From childhood's hour I have not been as others were—I have not seen as others saw...",
  "And the silken sad uncertain rustling of each purple curtain...",
  "Ah, distinctly I remember it was in the bleak December...",
  "Quoth the Raven, 'Nevermore.'",
  "All that we see or seem is but a dream within a dream.",
  "The boundaries which divide Life from Death are at best shadowy and vague.",
  "Sleep, those little slices of death — how I loathe them.",
  "They who dream by day are cognizant of many things which escape those who dream only by night."
];


// 📜 Extracts a random line from a random loaded poem
export function getRandomLineFromPoems() {
  if (!loadedPoems.length) return null;

  const poem = loadedPoems[Math.floor(Math.random() * loadedPoems.length)];
  const lines = poem
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  if (!lines.length) return null;

  return lines[Math.floor(Math.random() * lines.length)];
}


// 🎭 Blended line picker: 50% chance from loaded poems, 50% from fallback
export function getRandomLineBlended() {
  const usePoemLine = Math.random() < 0.5;
  if (usePoemLine) {
    const poemLine = getRandomLineFromPoems();
    if (poemLine) return poemLine;
  }

  // fallback if poem failed or chosen randomly
  return fallbackLines[Math.floor(Math.random() * fallbackLines.length)];
}
