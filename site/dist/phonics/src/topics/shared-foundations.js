import {el,button} from '../core/foundation-dom.js';
import {inScope} from '../core/foundation-scope.js';
import {playVoice,playPhoneme,playAlphabetPractice} from '../core/shared-voice-player.js';
import {recordedSound,alphabetSoundId,alphabetClip} from '../audio/alphabet-resolver.js';

export function foundationAction(item,kind,variant){
 return kind==='name'?{kind:'letters',texts:[...(variant||item.letter||item.spellings?.[0]||item.label).replace(/[^a-z]/gi,'').toUpperCase()]}:{kind:'sound',id:alphabetSoundId(item)};
}
export function mountFoundations(root,{kind,data,scope,settings,life}){
 const source=kind==='alphabet'?data.alphabet:kind==='blends'?data.blends:data.families;
 const items=source.filter(item=>inScope(item,scope));
 const search=el('input','foundation-search');search.type='search';search.placeholder='Find a letter or sound';search.setAttribute('aria-label','Find a letter or sound');
 const grid=el('div','foundation-grid'),empty=el('p','fine','No sounds match this selection.');empty.hidden=true;root.append(search,grid,empty);
 let active=null,token=0,clear=()=>{};
 const stop=()=>{token++;active?.cancel();active=null;clear();};life.cleanups.push(stop);
 for(const item of items){
  const recording=recordedSound(alphabetSoundId(item)),soundParts=recording?.kind==='sound-parts';
  const card=el('section','foundation-card'),glyph=el('h2','foundation-glyph',item.letter?item.uppercase+' '+item.letter:item.label),status=el('p','fine foundation-status'),controls=el('div','actions');status.setAttribute('role','status');
  let variant=item.letter||item.spellings?.[0]||item.label;
  card.append(glyph);if(!item.letter)card.append(el('p','foundation-ipa','/'+item.ipa+'/'));
  if(item.spellings){const variants=el('div','foundation-variants');for(const spelling of item.spellings){const chip=button(spelling,()=>{stop();variant=spelling;glyph.textContent=spelling;for(const b of variants.children)b.setAttribute('aria-pressed',String(b===chip));},'foundation-variant');chip.setAttribute('aria-pressed',String(spelling===variant));variants.append(chip);}card.append(variants);}
  function play(kind){
   if(life.ended||life.paused||settings.muted){if(settings.muted)status.textContent='Sound is off.';return;}
   stop();const run=token,plan=kind==='practice'?{kind:'practice',letter:item.uppercase}:foundationAction(item,kind,variant);let index=0;
   clear=()=>{status.textContent='';card.classList.remove('is-playing');};
   card.classList.add('is-playing');status.textContent=kind==='practice'?'Sentence practice':kind==='name'?(item.letter?'Letter name':'Letter names'):soundParts?'Sound parts':'Sound only';
   const options={onError:()=>{if(run!==token)return;clear();status.textContent="Audio didn't load. Press the button to try again.";},onCancelled:()=>{if(run===token)clear();}};
   function next(){if(run!==token||life.ended)return;if(index>=plan.texts.length){clear();active=null;return;}active=playVoice(plan.texts[index++],{...options,onEnded:next});}
   if(plan.kind==='letters')next();else if(plan.kind==='practice')active=playAlphabetPractice(plan.letter,{...options,onEnded:()=>{clear();active=null;}});else active=playPhoneme(plan.id,{...options,onEnded:()=>{clear();active=null;}});
   if(window.gsap&&!life.reduced)life.own(gsap.fromTo(glyph,{scale:1},{scale:1.06,duration:.16,repeat:1,yoyo:true}));
  }
  const soundButton=button(soundParts?'Hear sound parts':'Sound',()=>play('sound'),'button');soundButton.disabled=!recording?.path;
  controls.append(button(item.letter?'Letter name':'Letter names',()=>play('name'),'button secondary'),soundButton);
  if(item.uppercase&&alphabetClip(item.uppercase,'practice'))controls.append(button('Sentence practice',()=>play('practice'),'button secondary'));
  if(!recording?.path)card.append(el('p','fine','Audio unavailable. Practise with your teacher.'));
  card.append(controls,status);if(item.note)card.append(el('p','fine',item.note));
  if(item.review){const details=el('details','fine');details.append(el('summary','','Teacher note'),el('p','',item.review));card.append(details);}
  card.dataset.search=[item.letter,item.label,item.ipa,...(item.spellings||[])].filter(Boolean).join(' ').toLowerCase();grid.append(card);
 }
 life.listen(search,'input',()=>{stop();for(const card of grid.children)card.hidden=!card.dataset.search.includes(search.value.trim().toLowerCase());empty.hidden=[...grid.children].some(card=>!card.hidden);});
 life.listen(window,'plants-sound',stop);const sync=()=>life.paused?active?.pause():active?.resume();life.listen(window,'plants-pause',sync);life.listen(document,'visibilitychange',sync);
 if(!items.length)empty.hidden=false;
}
