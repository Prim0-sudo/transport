// Installs a Polly narration bundle (JSON array of {text, b64}) as site/dist/audio/polly/<sha256(text)>.mp3
// and writes site/dist/audio/narration-manifest.json. Usage: node scripts/install-polly-bundle.mjs <bundle.json>
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const bundlePath = process.argv[2];
if (!bundlePath) throw Error('Pass the bundle path.');
const items = JSON.parse(fs.readFileSync(bundlePath, 'utf8'));
const root = path.resolve(import.meta.dirname, '..', 'site', 'dist', 'audio');
fs.mkdirSync(path.join(root, 'polly'), { recursive: true });
const manifestPath = path.join(root, 'narration-manifest.json');
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : { clips: {} };
for (const { text, b64 } of items) {
  const data = Buffer.from(b64, 'base64');
  // MP3 frames start with 0xFFE?, or an ID3 tag.
  if (!(data[0] === 0xff && (data[1] & 0xe0) === 0xe0) && data.subarray(0, 3).toString() !== 'ID3') throw Error(`Not an MP3: ${text}`);
  const name = crypto.createHash('sha256').update(text, 'utf8').digest('hex') + '.mp3';
  fs.writeFileSync(path.join(root, 'polly', name), data);
  manifest.clips[text] = `audio/polly/${name}`;
}
const out = {
  status: 'Recorded narration installed; device voice covers anything missing',
  provider: 'Amazon Polly', voice: 'Amy', engine: 'neural', locale: 'en-GB',
  clips: Object.fromEntries(Object.entries(manifest.clips).sort(([a], [b]) => a.localeCompare(b)))
};
fs.writeFileSync(manifestPath, JSON.stringify(out, null, 2) + '\n');
console.log(`Installed ${items.length} clips; manifest has ${Object.keys(out.clips).length}.`);
