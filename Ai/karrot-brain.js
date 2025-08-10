const riddles = [
  "I speak without a mouth and hear without ears. What am I?",
  "The more you take, the more you leave behind. What am I?",
  "I am always in front of you but can’t be seen. What am I?"
];

const poeLines = [
  "Deep into that darkness peering, long I stood there wondering, fearing...",
  "And my soul from out that shadow that lies floating on the floor...",
  "Once upon a midnight dreary, while I pondered, weak and weary..."
];

export function generateRiddle() {
  return riddles[Math.floor(Math.random() * riddles.length)];
}

export function generatePoem() {
  return poeLines[Math.floor(Math.random() * poeLines.length)];
}

export function mixPoeLines() {
  const line1 = poeLines[Math.floor(Math.random() * poeLines.length)];
  const line2 = riddles[Math.floor(Math.random() * riddles.length)];
  return `${line1} ${line2}`;
}
