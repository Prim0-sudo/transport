import {ACTIVE_VOICE} from './voice-config.js';
import {finishSound} from './reviewed-r-tail.js';
import {POLLY_ALPHABET,POLLY_SOUNDS} from './polly-bank.js';
import * as legacy from './legacy-alphabet-resolver.js';
import {REVIEWED_ALPHABET_SOUNDS,REVIEWED_SOUNDS} from './reviewed-phonics.js';
import {SENTENCE_ALPHABET_SOUNDS,SENTENCE_SOUNDS} from './reviewed-sentence-cuts.js';
import {FINAL_ALPHABET_SOUNDS,FINAL_SOUNDS} from './reviewed-final-five.js';
import {COMPARISON_ALPHABET_SOUNDS,COMPARISON_SOUNDS} from './reviewed-comparison.js';
import {LAST_ALPHABET_SOUNDS,LAST_SOUNDS} from './reviewed-last-w-oo.js';
function originalAlphabetClip(letter,slot){if(slot==='sound'&&Object.hasOwn(LAST_ALPHABET_SOUNDS,letter))return LAST_ALPHABET_SOUNDS[letter];if(slot==='sound'&&Object.hasOwn(FINAL_ALPHABET_SOUNDS,letter))return FINAL_ALPHABET_SOUNDS[letter];if(slot==='sound'&&Object.hasOwn(COMPARISON_ALPHABET_SOUNDS,letter))return COMPARISON_ALPHABET_SOUNDS[letter];if(slot==='sound'&&Object.hasOwn(SENTENCE_ALPHABET_SOUNDS,letter))return SENTENCE_ALPHABET_SOUNDS[letter];if(slot==='sound'&&Object.hasOwn(REVIEWED_ALPHABET_SOUNDS,letter))return REVIEWED_ALPHABET_SOUNDS[letter];return ACTIVE_VOICE==='polly'?POLLY_ALPHABET[letter]?.[slot]||null:legacy.alphabetClip(letter,slot);}
export function alphabetSoundId(item){return item.uppercase&&alphabetClip(item.uppercase,'sound')?'alphabet-'+item.uppercase.toLowerCase():item.sound||item.id;}
function originalRecordedSound(id){if(Object.hasOwn(LAST_SOUNDS,id))return LAST_SOUNDS[id];if(Object.hasOwn(FINAL_SOUNDS,id))return FINAL_SOUNDS[id];if(Object.hasOwn(COMPARISON_SOUNDS,id))return COMPARISON_SOUNDS[id];if(Object.hasOwn(SENTENCE_SOUNDS,id))return SENTENCE_SOUNDS[id];if(Object.hasOwn(REVIEWED_SOUNDS,id))return REVIEWED_SOUNDS[id];return ACTIVE_VOICE==='polly'?POLLY_SOUNDS[id]||null:legacy.recordedSound(id);}
export function curatedAlphabetAssets(){return [...new Set('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').flatMap(letter=>['name','sound','practice'].map(slot=>alphabetClip(letter,slot)?.path).filter(Boolean)))];}

export function alphabetClip(letter,slot){return finishSound(originalAlphabetClip(letter,slot));}
export function recordedSound(id){return finishSound(originalRecordedSound(id));}
