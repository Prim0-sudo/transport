import {PHASE_SOUNDS,PHASE_ALPHABET} from './curated-phases.js';
import {CURATED_PACK_SOUNDS} from './curated-44-pack.js';
import {CURATED_ALPHABET} from './curated-alphabet.js';
import {SOUND_RECORDINGS} from './phoneme-bank.js';
import {ALPHABET_REPAIRS} from './alphabet-repairs.js';
const LETTER_SOUNDS={A:'short-a',B:'b',C:'k',D:'d',E:'short-e',F:'f',G:'g',H:'h',I:'short-i',J:'j',K:'k',L:'l',M:'m',N:'n',O:'short-o',P:'p',Q:'qu',R:'r',S:'s',T:'t',U:'short-u',V:'v',W:'w',X:'ks',Y:'y',Z:'z'};
export function alphabetClip(letter,slot){const original=CURATED_ALPHABET[letter]?.[slot],repair=ALPHABET_REPAIRS[letter]?.[slot],clip=repair?.active&&repair.replacesSha256===original?.sha256?repair:original;if(slot==='sound'&&PHASE_ALPHABET[letter])return PHASE_ALPHABET[letter];return clip?.active&&clip.path?clip:null;}
export function alphabetSoundId(item){return item.uppercase&&alphabetClip(item.uppercase,'sound')?'alphabet-'+item.uppercase.toLowerCase():item.sound||item.id;}
export function recordedSound(id){if(id.startsWith('alphabet-')){const clip=alphabetClip(id.slice(9).toUpperCase(),'sound');return clip?{...clip,kind:'recording',reviewed:clip.reviewed??(!clip.repaired||clip.reviewStatus==='selected')}:null;}if(PHASE_SOUNDS[id])return PHASE_SOUNDS[id];for(const [letter,sound]of Object.entries(LETTER_SOUNDS)){const clip=sound===id&&alphabetClip(letter,'sound');if(clip)return {...clip,kind:'recording',reviewed:clip.reviewed??(!clip.repaired||clip.reviewStatus==='selected')};}return CURATED_PACK_SOUNDS[id]||SOUND_RECORDINGS[id]||null;}
export function curatedAlphabetAssets(){return [...new Set(Object.keys(CURATED_ALPHABET).flatMap(letter=>['name','sound','practice'].map(slot=>alphabetClip(letter,slot)?.path).filter(Boolean)))];}
