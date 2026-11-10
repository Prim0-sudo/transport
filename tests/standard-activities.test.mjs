import test from 'node:test';
import assert from 'node:assert/strict';
import '../site/dist/standard-data.js';
import '../site/dist/detective-model.js';
import '../site/dist/curriculum.js';
import '../site/dist/classroom-core.js';
const S=globalThis.TransportStandard,R=globalThis.TransportReveal,C=globalThis.TransportCurriculum;
test('mosaic has 120 unique shuffled covers and ends exactly at 30/45/60 seconds',()=>{
 for(const duration of [30,45,60]){const order=Array.from({length:120},(_,i)=>119-i),r=R.create('mosaic',duration,order);r.running=true;R.advance(r,duration*500);assert.equal(R.count(r),60);R.advance(r,duration*500-1);assert.equal(R.count(r),119);R.advance(r,1);assert.equal(R.count(r),120);assert.equal(r.running,false);assert.equal(r.assisted,true);}
});
test('a stopped/guess-held reveal never consumes hidden or Teacher-held time',()=>{
 const r=R.create();r.running=true;R.advance(r,5000);r.running=false;R.advance(r,500000);assert.equal(r.elapsed,5000);r.running=true;R.advance(r,5000);assert.equal(r.elapsed,10000);
});
test('independent correct guessing earns once; wrong, manual and timed reveals do not',()=>{
 const r=R.create();assert.equal(R.answer(r,true),1);assert.equal(R.answer(r,true),0);
 const wrong=R.create();R.answer(wrong,false);assert.equal(R.answer(wrong,true),0);
 const assisted=R.create();assisted.assisted=true;assert.equal(R.answer(assisted,true),0);
 const timed=R.create();timed.running=true;R.advance(timed,45000);assert.equal(R.answer(timed,true),0);
});
test('invalid settings and duplicate/missing mosaic covers are rejected',()=>{
 assert.throws(()=>R.create('mosaic',44));assert.throws(()=>R.create('other',45));assert.throws(()=>R.create('mosaic',45,Array(120).fill(0)));const r=R.create();r.order.pop();assert.equal(R.valid(r),false);
});
test('authored sorting membership is unique; ambiguous propulsion examples are excluded',()=>{
 const pool=C.rows.map(([id])=>({id:'vehicle.'+id}));
 for(const rule of S.sortRules)for(const item of S.sortingPool(rule,pool))assert.equal(rule.groups.filter(group=>group.members.includes(item.id)).length,1);
 const power=S.sortingPool(S.ruleFor('power'),pool).map(i=>i.id);for(const id of ['boat','yacht','glider','hot-air-balloon','space-shuttle'])assert.ok(!power.includes('vehicle.'+id));
 assert.ok(!S.sortingPool(S.ruleFor('surfaces'),pool).some(i=>i.id==='vehicle.space-shuttle'));
});
test('category/setup variants preserve old All/surface keys and keep new rules separate',()=>{
 assert.equal(S.variantFor('learn',{category:'all'}),'default');assert.equal(S.variantFor('wheel',{category:'water'}),'category:water');assert.equal(S.variantFor('sort',{rule:'surfaces'}),'default');assert.equal(S.variantFor('sort',{rule:'power'}),'rule:power');assert.deepEqual(S.setupFor('detective','pixel:60'),{kind:'pixel',duration:60});
});
test('filtered session pools cannot include out-of-scope IDs or silently consume other words',()=>{
 const entries=['a','b','c'].map(id=>({id,level:1,lessons:['land'],collections:['road'],eligibility:{learn:true}}));const c=new TransportClassroom({entries,questions:[],curriculum:C,storage:null});
 const s=c.prepare('learn',c.scope,'category:land',[entries[0],{id:'outside'}]);assert.deepEqual(s.pool.map(i=>i.id),['a']);assert.deepEqual(c.reserve(s,10).map(i=>i.id),['a']);
});
test('silhouette eligibility is explicit and excludes colour-dependent bus variants',()=>{
 assert.ok(!S.silhouetteIds.has('vehicle.bus'));assert.ok(!S.silhouetteIds.has('vehicle.school-bus'));assert.ok(S.silhouetteIds.has('vehicle.helicopter'));
});
const round=name=>({vehicle:{name},guessed:[],misses:0,awarded:false,assisted:false});
test('spelling wins after correctable mistakes, counts repeats freely and awards only once',()=>{
 const r=round('tram');S.guessSpelling(r,'z');S.guessSpelling(r,'z');assert.equal(r.misses,1);let reward=0;for(const letter of 'tram')reward+=S.guessSpelling(r,letter).reward;assert.equal(reward,1);assert.equal(r.terminal,'won');assert.equal(S.guessSpelling(r,'t').reward,0);
});
test('eight distinct misses lose; punctuation and spaces require no guesses; assisted wins earn zero',()=>{
 const lost=round('bus');for(const l of 'acdefghi')S.guessSpelling(lost,l);assert.equal(lost.misses,8);assert.equal(lost.terminal,'lost');assert.equal(S.guessSpelling(lost,'b').changed,false);
 const punct=round("tram's tram");let reward=0;for(const l of 'trams')reward+=S.guessSpelling(punct,l).reward;assert.equal(punct.terminal,'won');assert.equal(reward,1);
 const assisted=round('bus');assisted.assisted=true;for(const l of 'bus')assert.equal(S.guessSpelling(assisted,l).reward,0);
});
test('resource routes declare real absent content instead of reporting imaginary playable libraries',()=>{
 assert.deepEqual(Object.keys(S.hubs),['media','games','phonics','create']);assert.deepEqual(S.hubs.media.groups.map(g=>g[0]),['printables','books','videos','songs','presentation']);assert.ok(S.hubs.games.groups.some(g=>g[0]==='driving'));
});
