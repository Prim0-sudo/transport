import test from 'node:test';
import assert from 'node:assert/strict';
import '../site/dist/curriculum.js';
import '../site/dist/classroom-core.js';
const C=globalThis.TransportCurriculum,Classroom=globalThis.TransportClassroom;
class Storage {constructor(){this.values=new Map();}getItem(k){return this.values.get(k)||null;}setItem(k,v){this.values.set(k,v);}}
function fixture(storage=new Storage()){
 const legacy={scooter:'scooter',rickshaw:'rickshaw',subway:'subway (metro)'};
 const entries=C.rows.map(([key,name])=>({name:legacy[key]||name,zone:['boat','ship','ferry','speedboat','yacht','jet-ski'].includes(key)?'water':['airplane','helicopter','hot-air-balloon','glider','space-shuttle'].includes(key)?'air':'land',iconImages:[`images/${key}.png`]}));
 const questions=Array.from({length:8},(_,i)=>({q:`Question ${i}`,answers:[['A',''],['B',''],['C','']],correct:0}));
 C.prepare(entries,questions);
 return {entries,questions,storage,game:new Classroom({entries,questions,curriculum:C,storage,random:()=>.37})};
}
test('every source entry has a stable unique ID, useful metadata and explicit eligibility',()=>{
 const {entries}=fixture();assert.equal(new Set(entries.map(i=>i.id)).size,30);
 for(const entry of entries){assert.ok(entry.definition.length>20);assert.ok(entry.example.length>20);assert.ok(entry.alt.length>10);assert.ok(entry.lessons.length);assert.ok(entry.collections.length);assert.equal(typeof entry.eligibility.sort,'boolean');assert.equal(entry.iconImages.length,1);}
 assert.equal(entries.find(i=>i.id==='vehicle.scooter').name,'kick scooter');assert.ok(entries.find(i=>i.id==='vehicle.subway').aliases.includes('metro'));
});
test('six undated lessons and all three proposed levels have reachable words',()=>{
 const {game}=fixture();assert.equal(C.lessons.length,6);
 for(const lesson of C.lessons)assert.ok(game.words({level:'all',lesson:lesson.id,collection:'all'}).length);
 for(const level of C.levels)assert.ok(game.words({level:level.id,lesson:'all',collection:'all'}).length);
});
test('scope fields intersect; empty and one-word scopes remain exact',()=>{
 const {game}=fixture();assert.equal(game.words({level:'1',lesson:'water',collection:'emergency'}).length,0);
 assert.deepEqual(game.words({level:'2',lesson:'helping',collection:'farm'}).map(i=>i.id),['vehicle.tractor']);
 assert.equal(game.words({level:'1',lesson:'helping',collection:'farm'}).length,0);
});
test('safety questions intersect the same word scope and have stable three-choice IDs',()=>{
 const {game,questions}=fixture();assert.equal(game.pool('safety',{level:'all',lesson:'air',collection:'air'}).length,0);
 assert.equal(game.pool('safety',{level:'all',lesson:'water',collection:'water'}).length,1);
 for(const q of questions)assert.equal(new Set(q.answerIds).size,3);
});
test('space shuttle is explicitly excluded from land/water/air sorting',()=>{
 const {game}=fixture();assert.equal(game.pool('sort',{level:'all',lesson:'all',collection:'space'}).length,0);assert.equal(game.pool('learn',{level:'all',lesson:'all',collection:'space'}).length,1);
});
test('exhaustion produces a short final batch and avoids a repeated boundary word',()=>{
 const {game}=fixture(),session=game.prepare('learn');const seen=[];
 for(let batch=0;batch<5;batch++){const chosen=game.reserve(session,7);assert.equal(chosen.length,batch===4?2:7);for(const item of chosen){seen.push(item.id);game.complete(session.key,item.id);}}
 assert.equal(new Set(seen).size,30);assert.notEqual(game.reserve(session,7)[0].id,seen.at(-1));
});
test('exit returns only unanswered reservations to the front, without duplicates',()=>{
 const {game}=fixture(),session=game.prepare('sort'),chosen=game.reserve(session,4);game.complete(session.key,chosen[0].id);game.release(session.key);
 assert.deepEqual(game.reserve(session,3).map(i=>i.id),chosen.slice(1).map(i=>i.id));assert.equal(session.cycle.completed.length,1);
});
test('activities and relevant setup variants have independent queues',()=>{
 const {game}=fixture(),a=game.prepare('learn'),b=game.prepare('identify'),c=game.prepare('flip',game.scope,'pairs:10'),d=game.prepare('flip',game.scope,'pairs:20');
 game.reserve(a,10);assert.equal(b.cycle.remaining.length,30);game.reserve(c,10);assert.equal(d.cycle.remaining.length,30);assert.notEqual(a.key,b.key);
});
test('reload releases held IDs and reclaims the exact saved unfinished task',()=>{
 const f=fixture(),s=f.game.prepare('hangman'),chosen=f.game.reserve(s,3);f.game.complete(s.key,chosen[0].id);const body={answer:chosen[1].id,guessed:['a','z'],misses:1};f.game.save(s,body);
 const next=new Classroom({entries:f.entries,questions:f.questions,curriculum:C,storage:f.storage}),again=next.prepare('hangman');assert.deepEqual(next.restore(again),body);assert.ok(next.claim(again,chosen.slice(1).map(i=>i.id)));assert.equal(again.cycle.held.length,2);assert.ok(!again.cycle.remaining.includes(chosen[0].id));
});
test('changed eligible membership invalidates saved reservations and attempts',()=>{
 const {game,entries}=fixture(),s=game.prepare('learn');game.reserve(s,3);game.save(s,{round:0});entries[0].eligibility.learn=false;
 const changed=game.prepare('learn');assert.equal(changed.invalidated,true);assert.equal(changed.pool.length,29);assert.equal(game.restore(changed),null);assert.equal(changed.cycle.held.length,0);
});
test('settings persist only when Apply is called, with independent old-scope attempts',()=>{
 const f=fixture(),s=f.game.prepare('learn');f.game.reserve(s,2);f.game.save(s,{task:'old-scope'});const draft={level:'2',lesson:'all',collection:'farm'};
 assert.equal(f.game.scope.collection,'all');f.game.release(s.key);f.game.apply(draft);assert.equal(f.game.words().length,1);
 const again=new Classroom({entries:f.entries,questions:f.questions,curriculum:C,storage:f.storage});assert.equal(again.scope.collection,'farm');assert.deepEqual(again.restore(again.prepare('learn',C.normaliseScope())),{task:'old-scope'});
});
test('corrupt or old storage falls back honestly; quota failure retains this-tab progress',()=>{
 const storage=new Storage();storage.setItem('transport-town.classroom.v1','{broken');const f=fixture(storage);assert.ok(f.game.notice);assert.equal(f.game.words().length,30);
 storage.setItem('transport-town.classroom.v1',JSON.stringify({schema:0}));assert.ok(fixture(storage).game.notice);
 const failing={getItem:()=>null,setItem:()=>{throw Error('quota');}},q=fixture(failing).game;q.apply({level:'2',collection:'farm'});assert.equal(q.persistent,false);assert.equal(q.words().length,1);assert.match(q.notice,/tab only/);
});
