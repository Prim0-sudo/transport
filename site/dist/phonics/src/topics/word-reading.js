import {el,button} from '../core/foundation-dom.js';
import {playVoice} from '../core/shared-voice-player.js';
import {recordedSound} from '../audio/alphabet-resolver.js';
import {soundVolume} from '../audio/sound-volume.js';

import {soundPlan,PHONEMES} from './word-sound-plans.js';
export {soundPlan,PHONEMES} from './word-sound-plans.js';
export const WHEEL_SOUND_ASSETS=[...new Set(Object.keys(PHONEMES).filter(x=>x!=='i').map(id=>recordedSound(id)?.path).filter(Boolean))];

export function mountWheelReading(root,item,life,settings){
 const word=el('h2','wheel-word'),letters=[...item.label].map(c=>el('span',/[a-z]/i.test(c)?'wheel-letter':'wheel-separator',c)),status=el('p','wheel-reading-status'),actions=el('div','actions');
 word.setAttribute('aria-label',item.label);for(const letter of letters){letter.setAttribute('aria-hidden','true');word.append(letter);}root.append(word,status,actions);
 const spacing=el('label','reading-spacing','Gap between sounds ');
 const gap=el('input');gap.type='range';gap.min='0';gap.max='1000';gap.step='100';gap.value='200';
 const gapValue=el('output','','200 ms');spacing.append(gap,gapValue);root.append(spacing);
 gap.addEventListener('input',()=>{gapValue.textContent=gap.value+' ms';});
 const plan=soundPlan(item.label);let run=0,current=null,playing=false,steps=[],index=0,timer=null,voice=null,audio=null,tween=null,lastKind='spell';
 function clear(){for(const l of letters)l.classList.remove('is-active','is-silent');word.classList.remove('is-blending');}
 function cancelCurrent(){life.animations.delete(timer);life.animations.delete(tween);timer?.kill();tween?.kill();timer=null;tween=null;voice?.cancel();voice=null;if(audio){audio.onended=null;audio.onerror=null;audio.pause();audio=null;}}
 function stop(){run++;playing=false;cancelCurrent();clear();}
 function delay(fn,seconds=.65){if(window.gsap){timer=gsap.delayedCall(seconds,fn);life.own(timer);}else{const start=performance.now();let frame;const tick=()=>{if(life.ended)return;if(life.paused){frame=requestAnimationFrame(tick);return;}if(performance.now()-start>=seconds*1000)fn();else frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);timer={kill:()=>cancelAnimationFrame(frame),pause(){},resume(){}};life.cleanups.push(()=>timer?.kill());}}
 function next(){cancelCurrent();index++;playStep();}
 function playStep(){if(life.ended||life.paused||!playing)return;const token=run;current=steps[index];clear();if(!current){playing=false;status.textContent='Your turn: say '+item.label+'.';return;}
  current.indices.forEach(i=>letters[i]?.classList.add('is-active',...(current.silent?['is-silent']:[])));if(current.blend)word.classList.add('is-blending');
  status.textContent=current.silent?'Silent '+current.text:current.blend?'Blend it: '+item.label:current.kind==='sound'?'Sound '+(index+1)+' of '+(steps.length-1):'Letter '+(index+1)+' of '+(steps.length-1);
  const active=current.indices.map(i=>letters[i]);if(window.gsap&&!life.reduced){tween=gsap.fromTo(active,{scale:1},{scale:1.09,duration:.15,yoyo:true,repeat:1});life.own(tween);}
  const advance=()=>{if(token===run&&!life.ended&&!life.paused)next();};
  const afterAudio=()=>{
   if(token!==run||life.ended||life.paused)return;
   const seconds=Number(gap.value)/1000;
   if(!current.blend&&seconds>0)delay(advance,seconds);
   else advance();
  };
  if(settings.muted||current.silent){delay(advance);return;}
  if(current.kind==='sound'){const recording=recordedSound(current.sound);if(!recording?.path){stop();status.textContent='Audio unavailable. Practise with your teacher.';return;}audio=new Audio(new URL('../../'+recording.path,import.meta.url).href);audio.volume=soundVolume(current.sound);audio.preservesPitch=true;audio.onended=afterAudio;audio.onerror=()=>{if(token!==run)return;stop();status.textContent='Audio unavailable. Practise with your teacher.';};audio.play().catch(()=>{if(token!==run)return;stop();status.textContent='Audio could not play. Try again.';});return;}
  voice=playVoice(current.text,{onEnded:afterAudio,onError:()=>{if(token!==run)return;stop();status.textContent=current?.blend?'Word audio unavailable. Say it together.':'This letter recording is unavailable.';}});
 }
 function start(kind){stop();lastKind=kind;playing=true;index=0;steps=kind==='spell'?letters.flatMap((l,i)=>/[a-z]/i.test(l.textContent)?[{indices:[i],text:l.textContent.toUpperCase(),kind:'letter'}]:[]):plan.map(g=>({...g,text:g.indices.map(i=>letters[i].textContent).join(''),kind:'sound',silent:!g.sound}));steps.push({indices:letters.map((_,i)=>i),text:item.speechText||item.label,blend:true});playStep();}
 actions.append(button('Spell the word',()=>{if(!life.paused)start('spell');},'button secondary'));
 const decode=button('Sound it out',()=>{if(!life.paused&&plan)start('sound');},'button secondary');const pendingSound=plan?.some(g=>g.sound&&!recordedSound(g.sound)?.path);decode.disabled=!plan||pendingSound;if(!plan||pendingSound){decode.setAttribute('aria-describedby','wheel-decode-note');const note=el('p','fine',pendingSound?'Sound-out audio unavailable.':'Sound-out unavailable for this word.');note.id='wheel-decode-note';root.append(note);}const replay=button('Replay reading',()=>{if(!life.paused)start(lastKind);},'button secondary');actions.append(decode,replay,button('Stop reading',()=>{stop();status.textContent='Reading stopped.';},'text-button'));
 const sync=()=>{if(life.paused){run++;cancelCurrent();}else if(playing)playStep();};life.listen(window,'plants-pause',sync);life.listen(document,'visibilitychange',sync);life.listen(window,'plants-sound',()=>{stop();status.textContent=settings.muted?'Sound is off.':'';});life.cleanups.push(stop);
 return {spell:()=>start('spell'),stop};
}
