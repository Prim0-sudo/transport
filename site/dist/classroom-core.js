/* Fair per-activity/per-scope queues and versioned browser-local attempts.
 * Reference: Plants core/session-queues.js and game-engine.js session handling.
 * No DOM dependency: the model is exercised with deterministic storage/randomness.
 */
(() => {
  const unique = ids => [...new Set(ids)];
  class TransportClassroom {
    constructor({entries,questions,curriculum,storage,random=Math.random}) {
      this.entries=entries;this.questions=questions;this.curriculum=curriculum;this.random=random;
      this.storageKey='transport-town.classroom.v1';this.schema=1;this.notice='';
      try{this.storage=storage===undefined?globalThis.localStorage:storage;}catch{this.storage=null;}
      this.data={schema:1,revision:curriculum.revision,scope:curriculum.normaliseScope(),cycles:{},attempts:{}};
      try{
        const raw=this.storage?.getItem(this.storageKey);
        if(raw){const saved=JSON.parse(raw);if(saved.schema===1&&saved.revision===curriculum.revision&&saved.cycles&&saved.attempts&&typeof saved.cycles==='object'&&typeof saved.attempts==='object')this.data=saved;else this.notice='Older saved progress could not be restored. Choose a selection to begin.';}
      }catch{this.notice='Saved progress could not be read. This tab can still be used.';}
      this.data.scope=curriculum.normaliseScope(this.data.scope);
      // A reload releases reservations. A valid saved attempt will reclaim its exact IDs.
      for(const cycle of Object.values(this.data.cycles)){
        if(!Array.isArray(cycle.remaining)||!Array.isArray(cycle.held)||!Array.isArray(cycle.completed))continue;
        cycle.remaining=unique([...cycle.held,...cycle.remaining]).filter(id=>!cycle.completed.includes(id));cycle.held=[];
      }
    }
    get scope(){return this.data.scope;}
    get persistent(){return Boolean(this.storage);}
    shuffle(values){const a=[...values];for(let i=a.length-1;i>0;i--){const j=Math.floor(this.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
    words(scope=this.scope){const s=this.curriculum.normaliseScope(scope);return this.entries.filter(item=>this.curriculum.inScope(item,s));}
    pool(mode,scope=this.scope){const words=this.words(scope);if(mode==='safety'){const ids=new Set(words.map(i=>i.id));return this.questions.filter(q=>q.eligible&&q.relatedIds.some(id=>ids.has(id)));}return words.filter(item=>item.eligibility[mode]===true);}
    base(mode,scope=this.scope,variant='default'){const s=this.curriculum.normaliseScope(scope);return JSON.stringify([mode,s.level,s.lesson,s.collection,variant]);}
    prepare(mode,scope=this.scope,variant='default'){
      const pool=this.pool(mode,scope),ids=pool.map(i=>i.id),signature=[...ids].sort().join('|'),key=this.base(mode,scope,variant);
      let cycle=this.data.cycles[key],invalidated=false;
      const badCycle=cycle&&(!Array.isArray(cycle.remaining)||!Array.isArray(cycle.held)||!Array.isArray(cycle.completed)||[...cycle.remaining,...cycle.held,...cycle.completed].some(id=>!ids.includes(id))||new Set([...cycle.remaining,...cycle.held,...cycle.completed]).size!==ids.length);
      if(!cycle||cycle.signature!==signature||badCycle){
        invalidated=Boolean(this.data.attempts[key]);delete this.data.attempts[key];
        cycle=this.data.cycles[key]={signature,remaining:this.shuffle(ids),held:[],completed:[],last:null};
      }
      return {key,pool,signature,invalidated,cycle};
    }
    reserve(session,limit=10){
      const q=session.cycle,all=session.pool.map(i=>i.id);
      if(!all.length)return [];
      if(!q.remaining.length&&!q.held.length){q.remaining=this.shuffle(all);q.completed=[];if(q.remaining.length>1&&q.remaining[0]===q.last)q.remaining.push(q.remaining.shift());}
      const ids=q.remaining.splice(0,Math.max(1,Math.min(limit,all.length)));q.held=unique([...q.held,...ids]);this.persist();
      const map=new Map(session.pool.map(i=>[i.id,i]));return ids.map(id=>map.get(id));
    }
    claim(session,ids){
      const q=session.cycle,pending=unique(ids);
      if(pending.some(id=>!q.remaining.includes(id)&&!q.held.includes(id)))return false;
      q.remaining=q.remaining.filter(id=>!pending.includes(id));q.held=unique([...q.held,...pending]);this.persist();return true;
    }
    complete(key,id){const q=this.data.cycles[key];if(!q||!q.held.includes(id))return;q.held=q.held.filter(i=>i!==id);q.completed=unique([...q.completed,id]);q.last=id;this.persist();}
    release(key){const q=this.data.cycles[key];if(!q)return;q.remaining=unique([...q.held,...q.remaining]).filter(id=>!q.completed.includes(id));q.held=[];this.persist();}
    save(session,body){this.data.attempts[session.key]={schema:1,signature:session.signature,body:JSON.parse(JSON.stringify(body))};this.persist();}
    restore(session){const saved=this.data.attempts[session.key];if(!saved)return null;if(saved.schema!==1||saved.signature!==session.signature||!saved.body||typeof saved.body!=='object'){delete this.data.attempts[session.key];return null;}return JSON.parse(JSON.stringify(saved.body));}
    discard(key){delete this.data.attempts[key];this.release(key);}
    apply(scope){this.data.scope=this.curriculum.normaliseScope(scope);this.persist();}
    persist(){if(!this.storage)return;try{this.storage.setItem(this.storageKey,JSON.stringify(this.data));}catch{this.storage=null;this.notice='Progress is available in this tab only because browser storage is unavailable.';}}
  }
  globalThis.TransportClassroom=TransportClassroom;
})();
