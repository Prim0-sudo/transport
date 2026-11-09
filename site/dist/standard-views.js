/* Standard activity views over the classroom/session model. */
const standardEscape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
let teachingFitObserver=null;
function fitTeachingSubject(element,item){
  element.dataset.teachingId=item.id;
  const fit=()=>{
    const current=vehicles.find(v=>v.id===element.dataset.teachingId),frame=current&&globalThis.TransportTeachingBounds?.[current.image];
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

const learnGroupsKey='transport-learn-groups-met';
function learnGroupsMet(){try{return new Set(JSON.parse(localStorage.getItem(learnGroupsKey)||'[]'));}catch{return new Set();}}
function markLearnGroupMet(id){const met=learnGroupsMet();met.add(id);try{localStorage.setItem(learnGroupsKey,JSON.stringify([...met]));}catch{}}
const wordModes=new Set(['learn','wheel']);
function renderStandardCategories(mode){
  const learn=mode==='learn';
  renderStandardSetup(mode,learn?'Which words shall we meet?':'Choose words to explore',learn?'':'Your Teacher selection still applies.');els.round.textContent='Categories';
  const grid=document.createElement('div');grid.className='standard-choice-grid'+(learn?' learn-groups':'');
  const categories=wordModes.has(mode)?[...TransportStandard.categories,...TransportStandard.teachingCategories]:TransportStandard.categories;
  const covers={all:'vehicle.bus',land:'vehicle.car',water:'vehicle.ferry',air:'vehicle.airplane',space:'vehicle.space-shuttle'};
  for(const category of categories){const pool=filteredStandardPool(mode,{category:category.id});
    if(wordModes.has(mode)&&TransportStandard.teachingCategories.includes(category)&&!pool.length)continue;
    const button=standardButton('',()=>startGame(mode,{setup:{category:category.id}}),'standard-choice');
    const cover=wordModes.has(mode)&&individualTeachingImage(covers[category.id]||pool[0]?.id);
    const source=cover||category.image;
    button.innerHTML=`<img src="${source}" alt=""><strong>${category.label}</strong><span>${pool.length} ${pool.length===1?'word':'words'}</span>`;
    if(learn&&learnGroupsMet().has(category.id))button.dataset.met='true';
    button.disabled=!pool.length;grid.append(button);
  }
  if(learn){
    const shown=grid.querySelectorAll('.standard-choice').length,met=grid.querySelectorAll('[data-met]').length;
    els.round.textContent=`Groups ${met}/${shown}`;document.querySelector('.progress-track').hidden=false;els.progress.style.width=`${shown?met/shown*100:0}%`;
    els.scorePill.hidden=false;els.score.textContent="0";
  }
  if(mode==='learn'){
    const scenes=standardButton('',renderTeachingScenes,'standard-choice scene-entry');
    scenes.innerHTML=`<img src="images/teaching-scenes/street-crossing.png" alt=""><strong>Transport Scenes</strong><span>${transportScenes.length} interactive scenes</span>`;
    grid.append(scenes);
  }
  els.answers.append(grid);if(!classroom.pool(mode).length)standardRecoveryActions(els.answers);
}
const transportScenes=[...TransportStandard.teachingScenes,...(globalThis.TransportSceneLibrary?.scenes||[])];
const individualTeachingIds=new Set(globalThis.TransportSceneLibrary?.individualIds||[]);
function individualTeachingImage(id){
  return globalThis.TransportSceneLibrary?.individualImages?.[id]||'';
}
function setTeachingPicture(figure,scene){
  const image=figure.querySelector('img');
  const overlay=figure.querySelector('svg');
  overlay.setAttribute('viewBox',scene.viewBox||`0 0 ${scene.width} ${scene.height}`);
  const inscriptions=overlay.querySelector('g');
  inscriptions.replaceChildren();
  for(const [label,x,y] of scene.inscriptions||[]){
    const text=document.createElementNS('http://www.w3.org/2000/svg','text');
    text.setAttribute('x',x);
    text.setAttribute('y',y);
    text.textContent=label;
    inscriptions.append(text);
  }
  image.width=scene.width;
  image.height=scene.height;
  image.alt=scene.alt;
  image.src=`images/teaching-scenes/${scene.image}`;
}
function highlightTeachingPicture(figure,[,,path,kind]){
  const highlight=figure.querySelector('path');
  highlight.setAttribute('d',path);
  highlight.classList.toggle('scene-direction',kind==='direction');
}
const teachingFigureMarkup=`
  <figure class="teaching-scene-picture">
    <img>
    <svg aria-hidden="true" preserveAspectRatio="none"><path fill-rule="evenodd"></path><g></g></svg>
  </figure>
`;
function renderTeachingScenes(){
  renderStandardSetup('teaching-scenes','Explore transport scenes','Choose a label to highlight it in the picture.');
  els.modeBadge.textContent='TRANSPORT SCENES';
  els.round.textContent='Scene explorer';
  setStandardBack('Categories');

  const panel=document.createElement('div');
  panel.className='teaching-scenes';
  panel.innerHTML=`
    <div class="standard-actions scene-choices" role="group" aria-label="Choose a scene"></div>
    ${teachingFigureMarkup}
    <div class="standard-actions scene-labels" role="group" aria-label="Picture labels"></div>
    <p class="scene-description" role="status"></p>
  `;
  const scenes=transportScenes;
  const sceneChoices=panel.querySelector('.scene-choices');
  const labels=panel.querySelector('.scene-labels');
  const figure=panel.querySelector('figure');
  const description=panel.querySelector('.scene-description');
  let word='';
  const hear=standardButton('Hear label',()=>speak(word));
  const quickScenes=Math.min(3,scenes.length);
  const picker=document.createElement('select');
  picker.setAttribute('aria-label','More transport scenes');
  picker.add(new Option('More scenes…',''));
  picker.options[0].disabled=true;
  picker.onchange=()=>{if(picker.value)selectScene(Number(picker.value));};

  function selectScene(index){
    const scene=scenes[index];
    [...sceneChoices.querySelectorAll('button')].forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
    picker.value=index<quickScenes?'':String(index);
    setTeachingPicture(figure,scene);
    const buttons=scene.labels.map(([label],i)=>standardButton(label,()=>selectLabel(i)));
    function selectLabel(selected){
      const entry=scene.labels[selected];
      const [label,meaning]=entry;
      word=label;
      highlightTeachingPicture(figure,entry);
      description.textContent=`${label}. ${meaning}`;
      for(const [i,button] of buttons.entries())button.setAttribute('aria-pressed',String(i===selected));
    }
    labels.replaceChildren(...buttons,hear);
    selectLabel(0);
  }
  for(const [i,scene] of scenes.entries()){
    if(i<quickScenes)sceneChoices.append(standardButton(scene.title,()=>selectScene(i)));
    else picker.add(new Option(scene.title,String(i)));
  }
  if(scenes.length>quickScenes)sceneChoices.append(picker);
  els.answers.append(panel);
  selectScene(0);
  focusLandingHeading('questionText');
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
  const hub=TransportStandard.hubs[mode];renderStandardSetup(mode,hub.title,hub.description);state.hubGroup=groupId;els.round.textContent=mode==='games'?'Games':mode==='create'?'Reading cards':mode==='phonics'?'Sounds and words':'Resources';
  const group=hub.groups.find(g=>g[0]===groupId),root=document.createElement('div');root.className='standard-resource';
  if(globalThis.TransportMedia?.render(mode,groupId,root)){if(group)setStandardBack(hub.title);}
  else if(group){setStandardBack(hub.title);const heading=document.createElement('h3');heading.textContent=group[1];const text=document.createElement('p');text.textContent=group[2];root.append(heading,text,standardButton(`Back to ${hub.title}`,()=>renderStandardHub(mode)));}
  else{for(const [id,title,description] of hub.groups){const button=standardButton('',()=>renderStandardHub(mode,id),'resource-choice');const label=document.createElement('strong');label.textContent=title;const text=document.createElement('span');text.textContent=description;button.append(label,text);root.append(button);}}
  els.answers.append(root);
}
function standardBack(){
  if(state.mode==='teaching-scenes'){
    startGame('learn');
    els.answers.querySelector('.scene-entry').focus();
    return;
  }
  if(TransportStandard.hubs[state.mode]){if(state.hubGroup)renderStandardHub(state.mode);else goMenu();return;}
  if(state.choosing||state.recovery){goMenu();return;}
  if(['learn','wheel','sort','detective','flip'].includes(state.mode)){startGame(state.mode);return;}
  goMenu();
}

function renderStandardLearn(){
  const item=state.questions[state.round];
  state.practice=true;
  els.question.textContent='';
  els.stage.style.display='none';
  els.round.textContent=`Word ${state.round+1}/${state.questions.length}`;els.progress.style.width=`${state.round/state.questions.length*100}%`;
  const panel=document.createElement('div');
  panel.className='learn-word-card';
  const source=individualTeachingImage(item.id)||item.image;
  if(source){
    const image=document.createElement('img');
    image.src=source;
    image.alt=item.alt||`Miniature illustration of ${item.name}.`;
    panel.append(image);
  }
  const title=document.createElement('h2');
  title.textContent=item.name;
  const meaning=document.createElement('p');
  meaning.className='learn-meaning';
  meaning.textContent=item.definition;
  panel.append(title,meaning);
  els.answers.append(panel);
  els.scorePill.hidden=false;els.score.textContent=String(state.score);els.listen.hidden=false;els.listen.disabled=false;els.listen.textContent='Listen';setStandardBack('Categories');
  const row=document.createElement('div');row.className='standard-actions learn-actions';
  const previous=standardButton('Previous',()=>{if(!state.round)return;state.round--;renderQuestion();rememberAttempt();});previous.disabled=state.round===0;
  row.append(previous,standardButton(`Say “${item.name}”`,()=>speak(item.name)),standardButton('Hear the meaning',()=>speak(item.definition)),standardButton(state.round===state.questions.length-1?'Finish':'Next word',()=>{if(!(state.completedIds||[]).includes(item.id))state.score++;nextQuestion();},'standard-action learn-next'));
  els.answers.append(row);
}
function renderStandardSort(){
  const item=state.questions[state.round],rule=TransportStandard.ruleFor(state.setup?.rule||'surfaces');
  els.question.textContent=rule.prompt(item.name);els.helper.textContent=rule.description;setVehicle(item,true);setStandardBack('Sorting rules');
  for(const group of TransportStandard.availableGroups(rule,activeSession.pool))makeAnswer(group.label,'',group.members.includes(item.id),group.explanation,false,group.image,`${rule.id}.${group.id}`);
}
function renderStandardIdentify(){
  const round=state.questions[state.round],item=round.vehicle,pref=standardPreferences();
  els.question.textContent=pref.identifyTarget?'Which word names this picture?':item.definition;
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
  const round=state.questions[state.round];els.question.textContent='What is in the hidden picture?';els.helper.textContent=round.reveal.kind==='silhouette'?'Use the outline. Guess, or reveal the picture for practice.':'Start the reveal, then choose Guess when you are ready.';
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
