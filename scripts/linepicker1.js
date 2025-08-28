// linePicker.js
import { loadedPoems } from './poePoemsLoader.js';

const fallbackLines = [/* static Poe lines */];

export function getRandomLineFromPoems() {
  if (!loadedPoems.length) return null;
  const poem = loadedPoems[Math.floor(Math.random() * loadedPoems.length)];
  const lines = poem.split('\n').map(l => l.trim()).filter(Boolean);
  return lines[Math.floor(Math.random() * lines.length)];
}

export function getRandomLineBlended() {
  return Math.random() < 0.5 ? getRandomLineFromPoems() || fallbackLines[Math.floor(Math.random() * fallbackLines.length)] : fallbackLines[Math.floor(Math.random() * fallbackLines.length)];
}
