import {recordedSound,alphabetClip} from '../audio/alphabet-resolver.js';
import {soundVolume} from '../audio/sound-volume.js';
// One selected prerecorded voice. Missing clips never fall back to another voice.
export function createVoicePlayer({loadClip,createAudio}){
 let active=null;
 function cancel(){active?.cancel();}
 function play(text,{rate=1,onEnded=()=>{},onError=()=>{},onCancelled=()=>{},onProgress}={}){
  cancel();let audio=null,ended=false,paused=false,frame=0;
  const live=()=>!ended&&active===control;
  function progress(){
   if(!live()||paused)return;
   if(Number.isFinite(audio.duration)&&audio.duration>0)onProgress(audio.currentTime/audio.duration);
   frame=requestAnimationFrame(progress);
  }
  function detach(){if(frame)cancelAnimationFrame(frame);if(audio){audio.onended=null;audio.onerror=null;audio.pause();}}
  function fail(){if(!live())return;ended=true;detach();active=null;onError(new Error("Voice didn't load, try again"));}
  function start(){if(!live()||paused||!audio)return;try{Promise.resolve(audio.play()).then(()=>{if(onProgress&&live()&&!paused){if(frame)cancelAnimationFrame(frame);progress();}}).catch(fail);}catch{fail();}}
  const control={cancel(){if(ended)return;ended=true;detach();if(active===control)active=null;onCancelled();},pause(){paused=true;if(frame)cancelAnimationFrame(frame);audio?.pause();},resume(){paused=false;start();},setRate(value){rate=value;if(audio)audio.playbackRate=rate;}};
  active=control;
  Promise.resolve().then(()=>loadClip(text)).then(file=>{
   if(!live())return;
   audio=createAudio(file);audio.volume=soundVolume(text?.sound);audio.playbackRate=rate;audio.preservesPitch=true;
   audio.onended=()=>{if(!live())return;ended=true;detach();active=null;onEnded();};
   audio.onerror=fail;start();
  }).catch(fail);
  return control;
 }
 return {play,cancel};
}

let manifestPromise;
async function loadClip(text){
 if(text&&typeof text==='object'&&text.sound){const recording=recordedSound(text.sound);if(!recording?.path||!/^assets\/audio\/(?:recorded-phonemes|polly)\/[a-f0-9]{64}\.(?:wav|mp3)$/.test(recording.path))throw Error('Sound recording not supplied');return new URL('../../'+recording.path,import.meta.url).href;}
 if(text&&typeof text==='object'&&text.alphabetPractice){const clip=alphabetClip(text.alphabetPractice,'practice');if(!clip)throw Error('Alphabet practice is not approved');return new URL('../../'+clip.path,import.meta.url).href;}
 if(typeof text==='string'&&/^[A-Z]$/.test(text)){const clip=alphabetClip(text,'name');if(clip)return new URL('../../'+clip.path,import.meta.url).href;}
 manifestPromise??=fetch(new URL('../audio/narration-manifest.json',import.meta.url)).then(response=>{if(!response.ok)throw Error('Manifest unavailable');return response.json();}).catch(error=>{manifestPromise=null;throw error;});
 const manifest=await manifestPromise,file=manifest.clips[text];
 if(manifest.voice!=='Amy'||manifest.engine!=='neural'||manifest.locale!=='en-GB'||!/^assets\/audio\/(?:polly\/)?[a-f0-9]{64}\.mp3$/.test(file||''))throw Error('Voice clip unavailable');
 return new URL('../../'+file,import.meta.url).href;
}
const player=createVoicePlayer({loadClip,createAudio:file=>new Audio(file)});
export const playVoice=(text,options)=>player.play(text,options);
export const playPhoneme=(id,options)=>player.play({sound:id},options);
export const playAlphabetPractice=(letter,options)=>player.play({alphabetPractice:letter},options);
export const cancelVoice=()=>player.cancel();
