/* Standard activity views over the step-2 classroom/session model.
 * Uses existing Transport illustrations; no new scenery or asset generation.
 */
const standardEscape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
let teachingFitObserver=null;
function fitTeachingSubject(element,item){
  element.dataset.teachingId=item.id;
  const fit=()=>{
    const current=vehicles.find(v=>v.id===element.dataset.teachingId),frame=current&&TransportTeachingBounds[current.image];
    if(!frame)return;const width=element.clientWidth,height=element.clientHeight,[x,y,w,h]=frame.crop;if(!width||!height)return;
    const scale=Math.min(width/w,height/h);
    element.style.backgroundSize=`${frame.size[0]*scale}px ${frame.size[1]*scale}px`;
    element.style.backgroundPosition=`${(width-w*scale)/2-x*scale}px ${(height-h*scale)/2-y*scale}px`;
  };
  if(!teachingFitObserver){teachingFitObserver=new ResizeObserver(fit);teachingFitObserver.observe(element);}
  fit();
}
function standardPreferences(){return {identifyTarget:true,identifyAnswers:true,safetyQuestion:true,safetyAnswers:true,...classroom.data.preferences};}
function filteredStandardPool(mode,setup={}){return TransportStandard.poolFor(mode,classroom.pool(mode),setup);}
function standardSession(mode,setup={}){return classroom.prepare(mode,classroom.scope,TransportStandard.variantFor(mode,setup),filteredStandardPool(mode,setup));}

function renderStandardSetup(mode,title,helper=''){
  cancelCurrentWork();activeSession=null;
  state={...state,mode,questions:[],round:0,score:0,sessionKey:null,recovery:false,choosing:true,hubGroup:null,setup:{}};
  showScreen('game');document.getElementById('gameCard').dataset.mode=mode;
  els.modeBadge.textContent=modeInfo[mode]?.badge||title;els.question.textContent=title;els.helper.textContent=helper;
  clearVehiclePicture();els.stage.style.display='none';els.listen.hidden=true;els.emojiToggle.hidden=true;
  els.answers.replaceChildren();els.feedback.replaceChildren();els.scorePill.hidden=true;
  document.querySelector('.progress-track').hidden=true;els.round.textContent='Choose';
  setStandardBack('Games');
}
function setStandardBack(label){const button=document.getElementById('backMenuBtn');button.textContent=label;button.setAttribute('aria-label',`Back to ${label.toLowerCase()}`);button.title=`Back to ${label.toLowerCase()}`;}
function standardButton(label,action,className='standard-action'){const button=document.createElement('button');button.className=className;button.textContent=label;button.onclick=action;return button;}
function standardRecoveryActions(root){const row=document.createElement('div');row.className='standard-actions';row.append(standardButton('Change selection',()=>document.getElementById('teacherBtn').click()),standardButton('Games',goMenu));root.append(row);}

function renderStandardCategories(mode){
  renderStandardSetup(mode,'Choose words to explore','Your Teacher selection still applies.');els.round.textContent='Categories';
  const grid=document.createElement('div');grid.className='standard-choice-grid';
  for(const category of TransportStandard.categories){const pool=filteredStandardPool(mode,{category:category.id});
    const button=standardButton('',()=>startGame(mode,{setup:{category:category.id}}),'standard-choice');
    button.innerHTML=`<img src="${category.image}" alt=""><strong>${category.label}</strong><span>${pool.length} ${pool.length===1?'word':'words'}</span>`;
    button.disabled=!pool.length;grid.append(button);
  }
  els.answers.append(grid);if(!classroom.pool(mode).length)standardRecoveryActions(els.answers);
}
function renderStandardSortRules(){
  renderStandardSetup('sort','Choose a sorting rule','Each rule names exactly what to compare.');els.round.textContent='Sorting rules';
  const grid=document.createElement('div');grid.className='standard-choice-grid';let available=0;
  for(const rule of TransportStandard.sortRules){const pool=filteredStandardPool('sort',{rule:rule.id}),groups=TransportStandard.availableGroups(rule,pool),valid=groups.length>=2;available+=valid?1:0;
    const button=standardButton('',()=>startGame('sort',{setup:{rule:rule.id}}),'standard-choice');
    button.innerHTML=`<span class="rule-pictures">${rule.groups.map(group=>`<img src="${group.image}" alt="">`).join('')}</span><strong>${rule.label}</strong><span>${pool.length} words${valid?'':' · At least two groups needed'}</span><small>${rule.description}</small>`;
    button.disabled=!valid;grid.append(button);
  }
  els.answers.append(grid);if(!available)standardRecoveryActions(els.answers);
}
function renderStandardDetectiveSetup(){
  const pref=classroom.data.preferences?.detective||{kind:'mosaic',duration:45};
  renderStandardSetup('detective','Choose your picture clues');els.round.textContent='Detective setup';
  const panel=document.createElement('div');panel.className='standard-settings';
  panel.innerHTML='<label>Reveal <select aria-label="Reveal type"><option value="mosaic">Mosaic reveal</option><option value="pixel">Pixel reveal</option><option value="silhouette">Silhouette</option></select></label><label>Time <select aria-label="Reveal duration"><option value="30">30 seconds</option><option value="45">45 seconds</option><option value="60">60 seconds</option></select></label><p class="setup-availability" role="status"></p>';
  const kind=panel.querySelector('[aria-label="Reveal type"]'),duration=panel.querySelector('[aria-label="Reveal duration"]');
  kind.value=['mosaic','pixel','silhouette'].includes(pref.kind)?pref.kind:'mosaic';duration.value=[30,45,60].includes(pref.duration)?String(pref.duration):'45';
  const start=standardButton('Start Detective',()=>{const setup={kind:kind.value,duration:Number(duration.value)};classroom.data.preferences={...classroom.data.preferences,detective:setup};classroom.persist();startGame('detective',{setup});});
  const update=()=>{const pool=filteredStandardPool('detective',{kind:kind.value}),count=new Set(pool.map(item=>item.pictureGroup)).size;start.disabled=count<2;panel.querySelector('.setup-availability').textContent=count>=2?`${pool.length} eligible pictures. Guess before a full reveal to earn a star.`:'Choose another reveal type or a selection with at least two distinct pictures.';};
  kind.onchange=update;duration.onchange=update;panel.append(start);els.answers.append(panel);update();standardRecoveryActions(els.answers);
}
function renderStandardHub(mode,groupId=null){
  const hub=TransportStandard.hubs[mode];renderStandardSetup(mode,hub.title,hub.description);state.hubGroup=groupId;els.round.textContent='Resources';
  const group=hub.groups.find(g=>g[0]===groupId),root=document.createElement('div');root.className='standard-resource';
  if(group){setStandardBack(hub.title);const heading=document.createElement('h3');heading.textContent=group[1];const text=document.createElement('p');text.textContent=group[2];root.append(heading,text,standardButton(`Back to ${hub.title}`,()=>renderStandardHub(mode)));}
  else{for(const [id,title,description] of hub.groups){const button=standardButton('',()=>renderStandardHub(mode,id),'resource-choice');const label=document.createElement('strong');label.textContent=title;const text=document.createElement('span');text.textContent=description;button.append(label,text);root.append(button);}}
  els.answers.append(root);
}
function standardBack(){
  if(TransportStandard.hubs[state.mode]){if(state.hubGroup)renderStandardHub(state.mode);else goMenu();return;}
  if(state.choosing||state.recovery){goMenu();return;}
  if(['learn','wheel','sort','detective','flip'].includes(state.mode)){startGame(state.mode);return;}
  goMenu();
}

function renderStandardLearn(){
  const item=state.questions[state.round];state.practice=true;
  els.question.textContent=item.name;setVehicle(item,true);els.name.textContent='';
  els.definition.innerHTML=`${standardEscape(item.definition)}<span class="standard-example">${standardEscape(item.example)}</span>`;els.definition.classList.add('visible');
  els.scorePill.hidden=true;els.listen.hidden=true;setStandardBack('Categories');
  const row=document.createElement('div');row.className='standard-actions learn-actions';
  const previous=standardButton('Previous',()=>{if(!state.round)return;state.round--;renderQuestion();rememberAttempt();});previous.disabled=state.round===0;
  row.append(previous,standardButton('Hear word',()=>speak(item.name)),standardButton('Hear meaning',()=>speak(item.definition)),standardButton(state.round===state.questions.length-1?'Finish this set':'Next',()=>{if(!(state.completedIds||[]).includes(item.id))state.score++;nextQuestion();}));
  els.answers.append(row);
}
function renderStandardSort(){
  const item=state.questions[state.round],rule=TransportStandard.ruleFor(state.setup?.rule||'surfaces');
  els.question.textContent=rule.prompt(item.name);els.helper.textContent=rule.description;setVehicle(item,true);setStandardBack('Sorting rules');
  for(const group of TransportStandard.availableGroups(rule,activeSession.pool))makeAnswer(group.label,'',group.members.includes(item.id),group.explanation,false,group.image,`${rule.id}.${group.id}`);
}
function renderStandardIdentify(){
  const round=state.questions[state.round],item=round.vehicle,pref=standardPreferences();
  els.question.textContent=pref.identifyTarget?'Which word names this vehicle?':item.definition;
  setVehiclePicture(item);els.stage.style.display=pref.identifyTarget?'':'none';
  document.getElementById('gameCard').classList.toggle('hide-answer-emojis',!pref.identifyAnswers);
  if(round.choices.length<2){state.practice=true;setVehicle(item,true);els.stage.style.display=pref.identifyTarget?'':'none';els.question.textContent=`Practise: ${item.name}`;const note=document.createElement('p');note.className='practice-note';note.textContent='Only one distinct picture is available. This is practice.';els.answers.append(note,standardButton('Next word',nextQuestion));return;}
  for(const choice of round.choices)makeAnswer(choice.name,'',choice.id===item.id,`${item.name}. ${item.definition}`,true,pref.identifyAnswers?choice.image:'',choice.id);
  if(!pref.identifyAnswers)for(const icon of els.answers.querySelectorAll('.answer-icon'))icon.hidden=true;
}
function renderStandardSafety(){
  const round=state.questions[state.round],pref=standardPreferences(),item=vehicles.find(v=>round.relatedIds.includes(v.id));
  els.question.textContent=round.q;els.helper.textContent='Choose the safe action. You can correct a mistake.';
  if(item)setVehicle(item,false);else clearVehiclePicture();els.name.textContent='';els.stage.style.display=pref.safetyQuestion&&item?'':'none';
  for(const id of round.answerOrder){const i=round.answerIds.indexOf(id),a=round.answers[i];makeAnswer(a[0],pref.safetyAnswers?a[1]:'',i===round.correct,round.explain,false,'',id);}
  if(!pref.safetyAnswers)for(const icon of els.answers.querySelectorAll('.answer-icon'))icon.hidden=true;
}
function renderStandardDetective(){
  const round=state.questions[state.round];els.question.textContent='What vehicle is hidden?';els.helper.textContent=round.reveal.kind==='silhouette'?'Use the outline. Guess, or reveal the picture for practice.':'Start the reveal, then choose Guess when you are ready.';
  els.stage.style.display='none';els.listen.hidden=true;setStandardBack('Detective setup');
  detectiveView=new TransportDetectiveView({root:els.answers,item:round.vehicle,choices:round.choices,reveal:round.reveal,clock:work,held:work.held,
    onSolved:reward=>{state.score+=reward;state.answered=true;completeQuestion(round.vehicle.id);els.score.textContent=state.score;standardFeedback(`${round.vehicle.name}. ${round.vehicle.definition}${reward?'':' This was practice.'}`,nextQuestion);rememberAttempt();},
    onPractice:()=>{state.answered=true;completeQuestion(round.vehicle.id);nextQuestion();},onSave:()=>rememberAttempt()});
}
function standardFeedback(text,next=nextQuestion){els.feedback.replaceChildren();const p=document.createElement('p');p.textContent=text;const button=standardButton('Next',next,'next-btn');button.id='nextBtn';els.feedback.append(p,button);}
function renderStandardSpelling(){
  const round=state.questions[state.round],item=round.vehicle,letters=hangmanLetters(item.name),guessed=new Set(round.guessed);
  els.question.textContent='Complete the departure word';els.helper.textContent='Eight different wrong letters are allowed. Repeated guesses are free.';
  els.stage.style.display='none';els.listen.hidden=true;
  const words=item.name.split(' ').map(word=>`<span class="spelling-word">${[...word].map(c=>`<span class="hangman-letter">${!/^[a-z]$/i.test(c)||guessed.has(c.toLowerCase())||state.answered?standardEscape(c):''}</span>`).join('')}</span>`).join('');
  const keys=[...'abcdefghijklmnopqrstuvwxyz'].map(letter=>`<button class="hangman-key ${guessed.has(letter)?letters.includes(letter)?'correct':'wrong':''}" data-letter="${letter}" ${guessed.has(letter)||state.answered?'disabled':''}>${letter.toUpperCase()}</button>`).join('');
  els.answers.innerHTML=`<div class="transport-spelling"><div class="spelling-clue"><img src="${item.image}" alt="${state.answered?standardEscape(item.alt):'Transport picture clue'}"><p>${standardEscape(item.definition)}</p><button data-hear-spelling>Hear the word</button></div><section class="departure-ticket" aria-label="Departure word"><p class="ticket-title">Departure word</p><div class="hangman-word" aria-label="${state.answered?standardEscape(item.name):'Transport word to spell'}">${words}</div><div class="ticket-checks" aria-label="${8-round.misses} of 8 wrong-guess allowances remaining">${Array.from({length:8},(_,i)=>`<span class="${i<round.misses?'used':''}" aria-hidden="true">${i<round.misses?'×':'•'}</span>`).join('')}</div><p>${round.misses} / 8 different wrong letters${state.answered?letters.split('').every(l=>guessed.has(l))?' · Ready to depart':' · Word revealed for practice':''}</p><div class="hangman-keys" aria-label="Letter keyboard">${keys}</div><button data-show-spelling ${state.answered?'disabled':''}>Reveal word for practice</button></section></div>`;
  els.answers.querySelector('[data-hear-spelling]').onclick=()=>speak(item.name);
  for(const button of els.answers.querySelectorAll('[data-letter]'))button.onclick=()=>chooseHangmanLetter(button.dataset.letter);
  els.answers.querySelector('[data-show-spelling]').onclick=()=>{if(state.answered||work.held)return;round.assisted=true;state.answered=true;completeQuestion(item.id);renderStandardSpelling();standardFeedback(`${item.name}. This was practice.`);rememberAttempt();};
}
function illustrateFlipChoices(){
  const pool=classroom.pool('flip');for(const button of els.answers.querySelectorAll('.flip-choice')){const art=document.createElement('span');art.className='flip-choice-art';for(const item of pool.slice(0,3)){const image=document.createElement('img');image.src=item.image;image.alt='';art.append(image);}button.prepend(art);}
}
function renderStandardWheelSelection(){
  const game=state.wheel,item=game.selected;if(!item)return false;
  els.question.textContent=item.name;els.stage.style.display='';setVehicle(item,true);els.name.textContent='';
  els.definition.textContent=item.definition;els.definition.classList.add('visible');
  const row=document.createElement('div');row.className='standard-actions';row.append(standardButton('Hear word',()=>speak(item.name)),standardButton('Hear meaning',()=>speak(item.definition)),standardButton('Next word',nextWheelWord));els.answers.replaceChildren(row);return true;
}
function renderStandardTeacher(){
  const pref=standardPreferences();for(const key of ['identifyTarget','identifyAnswers','safetyQuestion','safetyAnswers'])document.querySelector(`[data-picture-setting="${key}"]`).checked=pref[key]!==false;
}
function applyStandardTeacher(){
  const pref=standardPreferences(),old=JSON.stringify(pref);
  for(const input of document.querySelectorAll('[data-picture-setting]'))pref[input.dataset.pictureSetting]=input.checked;
  const changed=old!==JSON.stringify(pref),current=activeSession;
  if(changed&&current&&['identify','safety'].includes(state.mode))rememberAttempt();
  classroom.data.preferences=pref;classroom.persist();
  if(changed&&current&&['identify','safety'].includes(state.mode))restoreAttempt(current);
}
