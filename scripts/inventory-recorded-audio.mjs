// Read-only source inventory. No speech generation, audio edits or runtime install.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {readTransportContent} from './content-source.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const plants=resolve(process.argv[2]||join(root,'../plants-weekly-game'));
const town=resolve(process.argv[3]||join(root,'../our-town-game'));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const readJson=async path=>JSON.parse(await readFile(path,'utf8'));
const revision=dir=>execFileSync('git',['rev-parse','HEAD'],{cwd:dir,encoding:'utf8'}).trim();
const sources=[];
for(const [name,dir,manifestPath] of [['Plants',plants,'src/audio/narration-manifest.json'],['Our Town',town,'src/audio/voice-manifest.json']]) {
  const bytes=await readFile(join(dir,manifestPath)),manifest=JSON.parse(bytes);
  if(manifest.voice!=='Amy'||manifest.engine!=='neural'||manifest.locale!=='en-GB')throw Error('Review narration configuration for '+name);
  sources.push({name,dir,revision:revision(dir),manifestPath,manifestSha256:hash(bytes),manifest});
}
const {entries,questions,rules}=await readTransportContent();
const requested=new Map();
function add(text,owner){if(!text)return;const record=requested.get(text)||{text,owners:[]};record.owners.push(owner);requested.set(text,record);}
for(const item of entries){add(item.name,`${item.id}:word`);add(item.definition,`${item.id}:meaning-and-identify-clue`);add(`This is a ${item.name}.`,`${item.id}:learn-listen`);}
for(const rule of rules){const ids=new Set(rule.groups.flatMap(group=>group.members));for(const item of entries.filter(item=>ids.has(item.id)))add(rule.prompt(item.name),`${item.id}:sort-${rule.id}`);}
for(const question of questions)add(question.q,question.id+':question');
add('Which word names this vehicle?','identify:picture-prompt');add('You found every match!','flip:completion');
const records=[];
for(const request of requested.values()){
  const matches=[];
  for(const source of sources){
    const path=source.manifest.clips[request.text];if(!path)continue;
    if(!/^assets\/audio\/(?:polly\/)?[a-f0-9]{64}\.mp3$/.test(path))throw Error('Review unexpected clip path: '+path);
    const bytes=await readFile(join(source.dir,path)),sha256=hash(bytes);
    if(!path.endsWith(sha256+'.mp3'))throw Error('Source hash differs from filename: '+path);
    matches.push({source:source.name,path,sha256,bytes:bytes.length,sourceManifestStatus:source.manifest.status,acceptance:'Exact installed source match; listening/acceptance not inferred from a filename.'});
  }
  records.push({...request,status:matches.length?'exact-source-match':'missing-recording',matches});
}
const resolver=await import(pathToFileURL(join(plants,'src/audio/alphabet-resolver.js')));
const bank=await import(pathToFileURL(join(plants,'src/audio/polly-bank.js')));
const {soundVolume}=await import(pathToFileURL(join(plants,'src/audio/sound-volume.js')));
async function describe(clip,id){
  if(!clip?.path)return {id,status:'missing'};
  const bytes=await readFile(join(plants,clip.path)),sha256=hash(bytes);
  if(clip.sha256!==sha256)throw Error('Resolved shared source hash mismatch: '+id);
  return {id,...clip,bytes:bytes.length,sha256,playbackVolume:soundVolume(id),status:'resolved-source-not-installed-in-Transport'};
}
const sounds=[];for(const id of Object.keys(bank.POLLY_SOUNDS))sounds.push(await describe(resolver.recordedSound(id),id));
const alphabet=[];for(const letter of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'){
  const slots={};for(const slot of ['name','sound','practice'])slots[slot]=await describe(resolver.alphabetClip(letter,slot),slot==='sound'?'alphabet-'+letter.toLowerCase():letter);
  alphabet.push({letter,...slots});
}
const preservationFiles=['src/core/shared-voice-player.js','src/core/audio.js','src/audio/alphabet-resolver.js','src/audio/legacy-alphabet-resolver.js','src/audio/voice-config.js','src/audio/sound-volume.js','src/audio/reviewed-r-tail.js','src/audio/reviewed-phonics.js','src/audio/reviewed-sentence-cuts.js','src/audio/reviewed-final-five.js','src/audio/reviewed-comparison.js','src/audio/reviewed-last-w-oo.js','src/topics/word-reading.js','src/topics/word-sound-plans.js'];
const preserve=[];for(const path of preservationFiles)preserve.push({path,sha256:hash(await readFile(join(plants,path)))});
const missing=records.filter(record=>!record.matches.length),matched=records.length-missing.length;
const result={schema:1,date:'2026-11-09',status:'Inventory only; no generation, installation or listening acceptance',transportSourceRevision:revision(root),sources:sources.map(({dir,manifest,...source})=>({...source,manifestStatus:manifest.status})),
  currentPlayback:{uniqueTexts:records.length,exactSourceMatches:matched,missingTexts:missing.length,missingCharacters:missing.reduce((sum,r)=>sum+[...r.text].length,0),records},
  sharedFoundations:{source:'Plants',sounds,alphabet,preserve,precedence:'LAST > FINAL > COMPARISON > SENTENCE > REVIEWED > active Polly/legacy. R finishSound substitutes the accepted 80 ms tail-fade hash. Preserve exact resolved bytes, not the historical base bank alone.',volumePolicy:{m:0.7,'alphabet-m':0.7,r:0.1,'alphabet-r':0.1,'voiced-th':0.5,other:1}},
  excludedFromCurrentCount:['Unimplemented media/applied-game narration','Draft additional concepts and example sentences','Unimplemented spelling/phonics reading sequences','Obsolete inaccessible sound-recognition prompt'],
  migrationGate:['Freeze actual playback text after teacher/content review.','Reuse exact matches with source provenance and acceptance notes.','Quote only remaining deduplicated Amy Neural en-GB requests and obtain a new spending cap before generation.','Install all needed recordings and the accepted player/resolver/gain/cut policy together.','Remove browser synthesis; show honest unavailable/retry text for failures.','Commit/push, then check decode, normal/slow/replay, mute, overlapping holds and stale completion; listening acceptance is separate.']};
await mkdir(join(root,'docs/audio'),{recursive:true});
await writeFile(join(root,'docs/audio/RECORDED-AUDIO-INVENTORY.json'),JSON.stringify(result,null,2)+'\n');
await writeFile(join(root,'docs/audio/MISSING-CURRENT-NARRATION.json'),JSON.stringify({status:'Unfunded draft request list; do not submit to a generation service',voice:'Amy',engine:'neural',locale:'en-GB',characters:result.currentPlayback.missingCharacters,requests:missing.map(({text,owners})=>({text,owners}))},null,2)+'\n');
console.log(`${records.length} actual playback texts: ${matched} exact source matches, ${missing.length} missing (${result.currentPlayback.missingCharacters} characters). Resolved ${sounds.length} sound IDs and ${alphabet.length} alphabet entries; nothing installed.`);
