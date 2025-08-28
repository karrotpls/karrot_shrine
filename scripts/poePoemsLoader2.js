export const poeFilenames = [
  "aDream",
  "aDreamWithinADream",
  "acrosticElizabeth",
  "alAaraaf",
  "alone",
  "annabelLee",
  "bridalBallad",
  "dreamLand",
  "eldorado",
  "elizabeth",
  "enigma",
  "eulalie",
  "eveningStar",
  "fairyLand",
  "israfel",
  "lenore",
  "sonnetToScience",
  "spiritsOfTheDead",
  "tamerlane",
  "theBells",
  "theCityInTheSea",
  "theColiseum",
  "theConquerorWorm",
  "theHauntedPalace",
  "theSleeper",
  "theraven",
  "toF",
  "toHelen",
  "toMLS",
  "toMyMother",
  "toScience",
  "toTheRiver",
  "ulalume"
];

export let loadedPoems = [];

export async function loadAllPoems() {
  const promises = poeFilenames.map(name =>
    fetch(`./Poe/${name}.js`)
      .then(res => res.ok ? res.text() : '')
      .then(code => {
        const match = code.match(/export\s+default\s+(`[\s\S]*?`|'[\s\S]*?'|"[\s\S]*?")/);
        return match ? match[1].slice(1, -1) : '';
      })
      .catch(() => '')
  );

  loadedPoems = (await Promise.all(promises)).filter(Boolean);
}
