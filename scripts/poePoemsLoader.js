export const poeFilenames = [ /* your list of poem names */ ];
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
