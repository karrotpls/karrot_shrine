// js/karrot-brain.js

const poePoems = [
  `Once upon a midnight dreary, while I pondered, weak and weary...`,
  `Deep into that darkness peering, long I stood there wondering, fearing...`,
  `And the silken sad uncertain rustling of each purple curtain...`,
  `Ah, distinctly I remember it was in the bleak December...`,
  `From childhood's hour I have not been as others were—I have not seen as others saw...`,
  `Take this kiss upon the brow! And, in parting from you now...`,
  `Lo! 'tis a gala night within the lonesome latter years!...`,
  `In visions of the dark night I have dreamed of joy departed—`,
  `Thou wouldst be loved? — then let thy heart...`,
  `Helen, thy beauty is to me like those Nicean barks of yore...`,
  `I stand amid the roar of a surf-tormented shore...`,
  `And the raven, never flitting, still is sitting, still is sitting...`,
  `All that we see or seem is but a dream within a dream...`,
  `I dwelt alone in a world of moan...`,
  `By a route obscure and lonely, haunted by ill angels only...`,
  `Dim vales — and shadowy floods — and cloudy-looking woods...`,
  `Leave my loneliness unbroken! — quit the bust above my door!...`,
  `Science! true daughter of Old Time thou art!`,
  `Is all that we see or seem but a dream within a dream?`,
  `Seraph! thy memory is to me...`,
  `The skies they were ashen and sober; the leaves they were crisped and sere...`,
  `Hear the sledges with the bells—silver bells!`,
  `And so being young and dipped in folly, I fell in love with melancholy.`,
  `It was many and many a year ago, in a kingdom by the sea...`,
  `The angels, not half so happy in Heaven, went envying her and me—`,
  `With a love that the wingèd seraphs of Heaven coveted her and me.`,
  `They who dream by day are cognizant of many things...`,
  `We loved with a love that was more than love...`,
  `In the greenest of our valleys, by good angels tenanted...`,
  `Take thy beak from out my heart, and take thy form from off my door!`,
  `This and more I sat divining, with my head at ease reclining...`,
  `The soul shall find itself alone...`,
  `I was a child and she was a child, in this kingdom by the sea...`,
  `Over the mountains of the moon, down the valley of the shadow...`
];

function getRandomLine() {
  return poePoems[Math.floor(Math.random() * poePoems.length)];
}

export function getKarrotReply(prompt = "") {
  const tone = /poem|raven|dark/i.test(prompt) ? "dark" : "random";
  if (tone === "dark") {
    return `🖤 Karrot whispers:\n"${getRandomLine()}"\n...and fades into thought.`;
  } else {
    return `🧠 Karrot muses:\n"${getRandomLine()}"`;
  }
}
