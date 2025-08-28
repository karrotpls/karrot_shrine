import { loadedPoems } from './poePoemsLoader.js';

const fallbackLines = [
  "Once upon a midnight dreary, while I pondered, weak and weary...",
  "Deep into that darkness peering, long I stood there wondering, fearing...",
  "And the silken sad uncertain rustling of each purple curtain...",
  "Ah, distinctly I remember it was in the bleak December...",
  "From childhood's hour I have not been as others were—I have not seen as others saw...",
  "All that we see or seem is but a dream within a dream.",
  "Quoth the Raven, 'Nevermore.'"
];

export function getRandomLineFromPoems() {
  if (!loadedPoems.length) return null;
  const poem = loadedPoems[Math.floor(Math.random() * loadedPoems.length)];
  const lines = poem.split('\n').map(l => l.trim()).filter(Boolean);
  return lines[Math.floor(Math.random() * lines.length)];
}

export function getRandomLineBlended() {
  const usePoemLine = Math.random() < 0.5;
  if (usePoemLine) {
    const poemLine = getRandomLineFromPoems();
    if (poemLine) return poemLine;
  }
  return fallbackLines[Math.floor(Math.random() * fallbackLines.length)];
}
