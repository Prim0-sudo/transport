// Authoring output only: never installs unapproved concepts or art into the app.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {readTransportContent} from './content-source.mjs';
const root=new URL('../',import.meta.url),{entries}=await readTransportContent(root);
const input=await readFile(new URL('content/transport-extension.psv',root),'utf8');
const [header,...lines]=input.trim().split(/\r?\n/),keys=header.split('|');
const proposals=lines.map(line=>{
  const values=line.split('|');if(values.length!==keys.length)throw Error('Review draft columns: '+line);
  const row=Object.fromEntries(keys.map((key,i)=>[key,values[i]]));
  return {id:`${row.kind}.${row.key}`,label:row.label,kind:row.kind,level:Number(row.level),lessons:[row.lesson],collections:[row.collection],definition:row.definition,example:row.example,imageBrief:row.imageBrief,
    aliases:row.key==='pavement'?['sidewalk']:row.key==='refuse-truck'?['rubbish truck','garbage truck']:row.key==='tipper-truck'?['dump truck']:[],
    status:'draft-not-runtime',image:null,alt:null,proposedActivities:row.kind==='action'||['visibility','safe-distance','speed-limit'].includes(row.key)?['learn-with-context','read-draw-talk','applied-context']:['learn','identify-after-picture-review','spelling','matching','wheel'],
    sortEligibility:'Requires an authored rule; never inferred from kind or filename.',detectiveEligibility:'Pending picture and outline review; off by default.',readingPlanStatus:'Explicit plan and teacher review required.',factualReview:'Draft meaning; specialist/locale review required where relevant.',teacherAcceptance:'pending'};
});
const plan={schema:1,date:'2026-11-09',status:'Draft curriculum, not an expanded live bank',sourceSha256:createHash('sha256').update(input).digest('hex'),activeCount:entries.length,proposedAdditionalCount:proposals.length,plannedTotal:entries.length+proposals.length,
  lessons:[{id:'everyday',objective:'Name familiar journeys, places, passengers and vehicle parts.'},{id:'land',objective:'Compare road and rail vehicles, parts, routes and movement.'},{id:'water',objective:'Compare watercraft, harbour places, wind and people power.'},{id:'air',objective:'Compare aircraft and space vehicles, flight parts and take-off/landing.'},{id:'helping',objective:'Connect vehicles and workers with carrying, repair and helping tasks.'},{id:'safety',objective:'Recognise adult-supported safe journey choices and equipment.'}],
  additionalCollections:['vehicle-parts','journey-places','people-at-work','journey-actions','safe-journeys'],
  activeEntries:entries,proposals,
  activationGate:['Review useful breadth and meanings with the teacher.','Create and show approved complete pictures/context/comparisons and meaningful alt text.','Author exact activity rules, distinct picture groups, sound plans and recorded narration.','Generalise the vehicle-only runtime adapters before introducing parts, places, people or actions.','Commit/push and validate all IDs/scopes/coverage before local classroom review.']};
await mkdir(new URL('docs/content/',root),{recursive:true});
await writeFile(new URL('docs/content/CURRICULUM-PLAN.json',root),JSON.stringify(plan,null,2)+'\n');
const rows=proposals.map(p=>`| ${p.id} | ${p.label} | ${p.level} | ${p.lessons.join(', ')} | ${p.definition} |`).join('\n');
await writeFile(new URL('docs/content/CURRICULUM-REVIEW.md',root),`# Transport curriculum review\n\n${entries.length} current entries + ${proposals.length} proposed additions = ${plan.plannedTotal} planned concepts. **Only ${entries.length} are currently reachable.** Proposals have no installed pictures, alt text, sound plans or acceptance. They are not scored or exposed in the learner app. Source: content/transport-extension.psv.\n\nThe six undated lessons retain their existing IDs. Levels are proposed word/concept demands, not ages. Five additional collections are proposed alongside the existing ten. Repeated uses across lessons do not add to the concept count. Aliases are not extra entries. Vehicle subtypes are retained only for visible, useful contrasts: kick/motor scooter; pulled/cycle/auto-rickshaw; boat/rowboat/sailboat/canoe/kayak; shuttle/rocket.\n\nNew kinds require context-aware runtime adapters. Actions use sequences; parts use whole-subject context; abstract safety concepts stay out of independent picture/Detective tests until a defensible task is authored. No automatic Land/Water/Air membership is proposed for people, places or parts.\n\n| Stable proposed ID | Label | Level | Lesson | Draft meaning |\n|---|---|---|---|---|\n${rows}\n\nImage briefs and example sentences are in CURRICULUM-PLAN.json and the editable PSV source. The teacher can approve, amend or remove proposals before production. Keeping a smaller useful set is preferable to inflating counts.\n`);
console.log(`Prepared ${entries.length} active + ${proposals.length} draft concepts; runtime unchanged.`);
