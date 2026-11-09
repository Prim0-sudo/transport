// Transport adapter for the shared Plants / Our Town phonics modules (Blueprint v6.0).
// The shared files beside this one are copied unchanged from Plants; only the word sound plans are Transport's own.
import {el,button} from './core/foundation-dom.js';
import {mountFoundations} from './topics/shared-foundations.js';
import {mountWheelReading} from './topics/word-reading.js';
import {PRONUNCIATION_NOTES} from './topics/word-sound-plans.js';
import {cancelVoice} from './core/shared-voice-player.js';

// Topic CVC (CVCC): curated short-vowel words, judged by sounds, not letter count (sh, ng are one sound each).
const CVC_IDS=new Set(['vehicle.bus','vehicle.van','vehicle.ship','part.wing','action.land']);
let dataPromise,current=null,held=false;
const remembered={};

function makeLife(){
  const life={animations:new Set(),cleanups:[],ended:false,paused:held,reduced:matchMedia('(prefers-reduced-motion: reduce)').matches};
  life.listen=(target,event,fn)=>{target.addEventListener(event,fn);life.cleanups.push(()=>target.removeEventListener(event,fn));};
  life.own=animation=>{if(life.paused)animation.pause();life.animations.add(animation);return animation;};
  life.setPaused=paused=>{life.paused=paused;life.animations.forEach(a=>a.paused(paused));};
  life.destroy=()=>{life.ended=true;life.cleanups.splice(0).forEach(fn=>fn());life.animations.forEach(a=>a.kill());life.animations.clear();};
  return life;
}

function foundations(root,kind,settings,life){
  root.textContent='Loading recordings and letter cards…';
  dataPromise??=fetch(new URL('./topics/shared-foundations.json',import.meta.url)).then(r=>{if(!r.ok)throw Error('Foundations unavailable');return r.json();}).catch(e=>{dataPromise=null;throw e;});
  dataPromise.then(data=>{
    if(life.ended)return;root.replaceChildren();
    mountFoundations(root,{kind,data,scope:{level:'all',lesson:'all',collection:'all'},settings,life});
    const search=root.querySelector('.foundation-search');search.value=remembered[kind]?.query||'';search.dispatchEvent(new Event('input'));
    life.listen(search,'input',()=>{remembered[kind]={query:search.value};});
  }).catch(()=>{if(!life.ended)root.textContent='The letter cards did not load. Go back and try again.';});
}

// Listen & Read (Plants word-practice-view mountSentence): no recorded sentences yet, so the browser voice reads
// and word boundaries drive the highlight.
function sentence(card,item,settings,life){
  const line=el('p','phonics-reading-sentence'),spans=[];let at=0;
  for(const token of item.sentence.split(/(\s+)/)){if(!token)continue;if(/^\s+$/.test(token)){line.append(token);at+=token.length;continue;}const span=el('span','reading-word',token);span.dataset.start=at;spans.push(span);line.append(span);at+=token.length;}
  const highlight=index=>spans.forEach((s,i)=>s.classList.toggle('is-reading',i===index));
  const status=el('p','wheel-reading-status'),actions=el('div','learn-actions');
  const stop=()=>{if('speechSynthesis' in window)speechSynthesis.cancel();highlight(-1);};
  const play=()=>{if(held)return;stop();if(settings.muted){status.textContent='Sound is off. Read the sentence together.';return;}
    if(!('speechSynthesis' in window)){status.textContent='Audio unavailable. Read together.';return;}
    const u=new SpeechSynthesisUtterance(item.sentence);u.lang='en-GB';u.rate=.82;
    u.onboundary=e=>{if(e.name&&e.name!=='word')return;let i=spans.findIndex(s=>+s.dataset.start>e.charIndex)-1;if(i<-1)i=spans.length-1;highlight(i<0?spans.length-1:i);};
    u.onend=()=>{highlight(-1);status.textContent='Your turn to read.';};u.onerror=()=>{highlight(-1);};
    status.textContent='Reading…';speechSynthesis.speak(u);};
  actions.append(button('Hear sentence',play,'standard-action'),button('Stop reading',()=>{stop();status.textContent='Reading stopped.';},'standard-action'));
  life.cleanups.push(stop);card.append(line,actions,status);
}

function words(root,kind,{words:all,categories,settings,readingCards=[]},life){
  const reading=kind==='reading';
  const items=reading?readingCards.map(c=>{const w=all.find(x=>x.id===c.itemId);return w&&{...w,...c,id:c.id,name:w.name};}).filter(Boolean):all.filter(w=>kind!=='cvc'||CVC_IDS.has(w.id));
  const state=remembered[kind]??={query:'',group:'all',id:null};
  const filters=el('div','phonics-word-filters'),findLabel=el('label','',reading?'Find a sentence':'Find a Transport word');
  const search=el('input','foundation-search');search.type='search';search.value=state.query;findLabel.append(search);
  const groupLabel=el('label','','Group'),group=el('select');const all0=el('option','','All groups');all0.value='all';group.append(all0);
  for(const category of categories){if(!items.some(w=>w.category===category.id))continue;const o=el('option','',category.label);o.value=category.id;group.append(o);}
  group.value=state.group;if(!group.value)group.value=state.group='all';groupLabel.append(group);filters.append(findLabel,groupLabel);
  const card=el('section','phonics-word-card');root.append(filters,card);
  let cardLife=null;
  function render(){
    cardLife?.destroy();cardLife=makeLife();card.replaceChildren();
    const query=state.query.trim().toLocaleLowerCase('en-GB');
    const pool=items.filter(w=>(state.group==='all'||w.category===state.group)&&(reading?w.sentence:w.name).toLocaleLowerCase('en-GB').includes(query));
    if(!pool.length){
      if(!items.length)card.append(el('p','empty-selection',kind==='cvc'?'None of the short words are in the Teacher word choice.':reading?'None of the sentence pictures are in the Teacher word choice.':'No words are in the Teacher word choice.'));
      else card.append(el('p','empty-selection','No matches.'),button('Clear search',()=>{if(held)return;search.value='';group.value='all';state.query='';state.group='all';render();search.focus();},'standard-action'));
      return;
    }
    let index=pool.findIndex(w=>w.id===state.id);if(index<0)index=0;const item=pool[index];state.id=item.id;
    card.append(el('p','phonics-word-position',`${reading?'Sentence':'Word'} ${index+1} of ${pool.length}`));
    const image=el('img','phonics-word-picture');image.src=item.image;image.alt=item.alt||item.name;card.append(image);
    if(reading){sentence(card,item,settings,cardLife);}else{
    const reader=el('div','plants-word-reader');card.append(reader);
    mountWheelReading(reader,{...item,label:item.name,speechText:item.name},cardLife,settings);
    if(item.definition)card.append(el('p','phonics-word-definition',item.definition));
    const notes=item.name.split(/[\s-]+/).map(w=>PRONUNCIATION_NOTES[w.toLowerCase()]).filter(Boolean);
    if(notes.length){const details=el('details','foundation-credits');details.append(el('summary','','Pronunciation note'),el('p','',notes.join(' ')));card.append(details);}
    }
    const nav=el('div','standard-actions');
    const focusNav=()=>card.querySelector('[data-word-previous]:not(:disabled),[data-word-next]:not(:disabled)')?.focus();
    const previous=button('Previous',()=>{if(held)return;state.id=pool[index-1].id;render();focusNav();},'standard-action');previous.disabled=index===0;previous.dataset.wordPrevious='';
    const next=button(reading?'Next sentence':'Next word',()=>{if(held)return;state.id=pool[index+1].id;render();focusNav();},'standard-action');next.disabled=index===pool.length-1;next.dataset.wordNext='';
    nav.append(previous,next);card.append(nav);
  }
  const update=()=>{state.query=search.value;state.group=group.value;render();};
  life.listen(search,'input',update);life.listen(group,'change',update);life.cleanups.push(()=>cardLife?.destroy());
  life.setPausedExtra=p=>cardLife?.setPaused(p);
  render();
}

globalThis.TransportPhonics={
  mount(root,section,context){
    this.destroy();
    const life=makeLife();current=life;
    const area=el('div','phonics-area');root.append(area);
    if(['words','cvc','reading'].includes(section))words(area,section,context,life);else foundations(area,section,context.settings,life);
    const credits=el('details','foundation-credits');credits.append(el('summary','','Audio credits'),el('p','','British English letter and sound recordings shared with Our Town and Plants, including Phonicademy material. Whole-word recordings for Transport are not made yet.'));
    root.append(credits);
  },
  setPaused(paused){held=paused;if(!current)return;current.setPaused(paused);current.setPausedExtra?.(paused);window.dispatchEvent(new Event('plants-pause'));},
  destroy(){if(current){current.destroy();current=null;}cancelVoice();}
};
window.dispatchEvent(new Event('transport-phonics-ready'));
