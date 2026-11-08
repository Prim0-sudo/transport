/* Adapted from the accepted Plants detective-model.js contract. */
(() => {
  const kinds=['mosaic','pixel','silhouette'],durations=[30,45,60];
  const validOrder=order=>Array.isArray(order)&&order.length===120&&new Set(order).size===120&&order.every(i=>Number.isInteger(i)&&i>=0&&i<120);
  function create(kind='mosaic',duration=45,order=Array.from({length:120},(_,i)=>i)){
    if(!kinds.includes(kind)||!durations.includes(duration)||!validOrder(order))throw Error('Invalid Detective settings');
    return {kind,duration,order:[...order],elapsed:0,running:false,guessing:false,assisted:false,complete:false,wrong:false,disabledIds:[]};
  }
  function advance(reveal,ms){
    if(!reveal.running||reveal.complete)return;
    reveal.elapsed=Math.min(reveal.duration*1000,reveal.elapsed+Math.max(0,ms));
    if(reveal.elapsed===reveal.duration*1000){reveal.running=false;reveal.assisted=true;reveal.guessing=true;}
  }
  const count=reveal=>Math.min(120,Math.floor(reveal.elapsed/(reveal.duration*1000)*120));
  function answer(reveal,correct){if(reveal.complete)return 0;if(!correct){reveal.wrong=true;return 0;}reveal.complete=true;reveal.running=false;return reveal.assisted||reveal.wrong?0:1;}
  function valid(reveal){return reveal&&kinds.includes(reveal.kind)&&durations.includes(reveal.duration)&&validOrder(reveal.order)&&Number.isFinite(reveal.elapsed)&&reveal.elapsed>=0&&reveal.elapsed<=reveal.duration*1000&&Array.isArray(reveal.disabledIds);}
  globalThis.TransportReveal={create,advance,count,answer,valid};
})();
