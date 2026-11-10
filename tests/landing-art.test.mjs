import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import vm from 'node:vm';

const repo = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, repo));
const ledgerPath = 'artwork/landing/coastal-station-miniature-world/art-ledger.json';
const runtime = 'site/dist/images/landing/coastal-station/';

test('every Coastal Station runtime image matches its art-ledger hash', async () => {
  const ledger = JSON.parse(await read(ledgerPath));
  const ids = Object.keys(ledger.runtime);
  assert.equal(ids.length, 20);
  for (const id of ids) {
    const bytes = await read(runtime + id + '.png');
    assert.equal(createHash('sha256').update(bytes).digest('hex'), ledger.runtime[id].sha256, id);
  }
});

test('the app placement file is the ledger placement block, unchanged', async () => {
  const ledger = JSON.parse(await read(ledgerPath));
  const context = vm.createContext({window: {}});
  vm.runInContext(String(await read(runtime + 'placement.js')), context);
  assert.deepEqual(JSON.parse(JSON.stringify(context.window.COASTAL_STATION)), ledger.placement);
});

test('the landing loads the placement before the scene and keeps the preview timings', async () => {
  const html = String(await read('site/dist/index.html'));
  const scene = String(await read('site/dist/landing-scene.js'));
  assert.ok(html.indexOf('coastal-station/placement.js') < html.indexOf('landing-scene.js'));
  assert.ok(scene.includes("'images/landing/coastal-station/'"));
  // Train stops by 4.25 s and reverses at 13 s; bus leaves 8.65 s; ferry leaves 12.35 s.
  for (const cue of ['3.9, ease', "x: train.arrival, duration: 6, ease: 'power1.in' }, 13)", '}, 8.65)', '}, 12.35)']) {
    assert.ok(scene.includes(cue), cue);
  }
});
