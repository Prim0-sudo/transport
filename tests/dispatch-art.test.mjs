import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';

const root = new URL('../site/dist/', import.meta.url);
const read = path => readFile(new URL(path, root));
const readTownArt = async () => JSON.parse(await readFile(new URL('../artwork/dispatch/miniature-world-town-v2/manifest.json', import.meta.url)));

test('every Dispatch map export in the runtime manifest is served with its recorded hash', async () => {
  const manifest = JSON.parse(await read('images/dispatch-map/runtime-manifest.json'));
  for (const asset of manifest.assets) {
    const bytes = await read('images/dispatch-map/' + asset.file);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), asset.sha256, asset.file);
  }
  const townArt = await readTownArt();
  for (const asset of townArt.assets) {
    const bytes = await readFile(new URL('../' + asset.runtime, import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), asset.runtimeSha256, asset.runtime);
  }
});

test('the road, bridge, pier, berth and fire art stay listed and wired into Dispatch', async () => {
  const manifest = JSON.parse(await read('images/dispatch-map/runtime-manifest.json'));
  const townArt = await readTownArt();
  const view = String(await read('dispatch-view.js'));
  for (const id of ['dock-pier', 'island-berth', 'incident-fire']) {
    assert.ok(manifest.assets.some(a => a.file === id + '.png'), id + ' missing from the manifest');
    assert.ok(view.includes(id + '.png'), id + ' not placed in dispatch-view.js');
  }
  for (const id of ['asphalt', 'stone-bridge', 'grass-field', 'river-water', 'verge-trees']) {
    assert.ok(townArt.assets.some(a => a.id === id), id + ' missing from the manifest');
    assert.ok(view.includes(id + '.webp'), id + ' not placed in dispatch-view.js');
  }
  assert.ok(!view.includes('🔥'), 'the fire marker should use the illustration, not the emoji');
});
