import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';

const root = new URL('../site/dist/', import.meta.url);
const read = path => readFile(new URL(path, root));

test('every Dispatch map export in the runtime manifest is served with its recorded hash', async () => {
  const manifest = JSON.parse(await read('images/dispatch-map/runtime-manifest.json'));
  for (const asset of manifest.assets) {
    const bytes = await read('images/dispatch-map/' + asset.file);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), asset.sha256, asset.file);
  }
});

test('the road, bridge, pier, berth and fire art stay listed and wired into Dispatch', async () => {
  const manifest = JSON.parse(await read('images/dispatch-map/runtime-manifest.json'));
  const view = String(await read('dispatch-view.js'));
  for (const id of ['road-surface', 'bridge-deck', 'dock-pier', 'island-berth', 'incident-fire']) {
    assert.ok(manifest.assets.some(a => a.file === id + '.png'), id + ' missing from the manifest');
    assert.ok(view.includes(id + '.png'), id + ' not placed in dispatch-view.js');
  }
  assert.ok(!view.includes('🔥'), 'the fire marker should use the illustration, not the emoji');
});
