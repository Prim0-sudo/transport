// Lists every taught word with its name, group and best picture, read from the app's own data.
// Usage: node scripts/export-printable-source.mjs <out.json>
import {readFile, writeFile, access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const file = name => new URL(name, root);
const exists = path => access(path).then(() => true, () => false);
const context = vm.createContext({});
for (const name of ['curriculum.js', 'standard-data.js', 'images/teaching-scenes/library.js'])
  vm.runInContext(await readFile(file(`site/dist/${name}`), 'utf8'), context, {filename: name});
const app = await readFile(file('site/dist/app.js'), 'utf8');
const boundary = app.indexOf('const classroom = new TransportClassroom(');
if (boundary < 0) throw Error('Review the printable adapter: app content boundary changed.');
vm.runInContext(app.slice(0, boundary) + '\nglobalThis.words=transportWords;', context, {filename: 'app-content.js'});

const {categories, teachingCategories} = context.TransportStandard;
const groups = [...categories.filter(group => group.id !== 'all'), ...teachingCategories];
const words = [];
for (const word of context.words) {
  if (!groups.some(group => group.id === word.category)) throw Error(`No printable group for ${word.id} (${word.category}).`);
  // Full-size original first; the web copy is only a fallback.
  const original = file(`artwork/originals/vocabulary/${word.id}.png`);
  const image = await exists(original) ? original : file(`site/dist/${word.image}`);
  if (!await exists(image)) throw Error(`Missing picture for ${word.id}.`);
  words.push({id: word.id, name: word.name, definition: word.definition || '', categoryId: word.category, image: decodeURIComponent(image.pathname.replace(/^\/([A-Za-z]:)/, '$1'))});
}
const usedGroups = groups.filter(group => words.some(word => word.categoryId === group.id)).map(({id, label}) => ({id, label}));
const contentHash = createHash('sha256').update(JSON.stringify(words.map(({id, name, definition, categoryId}) => [id, name, definition, categoryId]))).digest('hex');
const out = process.argv[2];
if (!out) throw Error('Usage: node scripts/export-printable-source.mjs <out.json>');
await writeFile(out, JSON.stringify({contentHash, categories: usedGroups, words}, null, 2));
console.log(`Exported ${words.length} words in ${usedGroups.length} groups.`);
