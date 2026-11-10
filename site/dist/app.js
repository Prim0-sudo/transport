const vehicles = [
  { name: "car", icon: "🚗", zone: "land", sound: "car", definition: "A four-wheeled motor vehicle used for everyday personal travel." },
  { name: "bus", icon: "🚌", zone: "land", sound: "bus", definition: "A large motor vehicle designed to carry many passengers along fixed routes." },
  { name: "bicycle", icon: "🚲", zone: "land", sound: "bicycle", definition: "A two-wheeled human-powered vehicle driven by pedals." },
  { name: "motorcycle", icon: "🏍️", zone: "land", sound: "motorcycle", definition: "A two-wheeled motor vehicle powered by an engine." },
  { name: "scooter", icon: "🛴", zone: "land", sound: "scooter", definition: "A lightweight two-wheeled vehicle with a small motor or pushed by foot." },
  { name: "train", icon: "🚆", zone: "land", sound: "train", definition: "A series of connected rail cars running on tracks for long-distance travel." },
  { name: "subway (metro)", icon: "🚇", zone: "land", sound: "subway", definition: "An underground electric railway system used in urban areas." },
  { name: "taxi", icon: "🚕", zone: "land", sound: "car", definition: "A car with a driver that carries passengers for a fare." },
  { name: "truck", icon: "🚚", zone: "land", sound: "truck", definition: "A heavy motor vehicle used for transporting goods and cargo." },
  { name: "van", icon: "🚐", zone: "land", sound: "car", definition: "A medium-sized vehicle used for carrying goods or a small group of people." },
  { name: "tram", icon: "🚋", zone: "land", sound: "tram", definition: "A passenger vehicle that runs on rails along public streets." },
  { name: "minibus", icon: "🚐", zone: "land", sound: "bus", definition: "A small bus that carries fewer passengers than a full-sized city bus." },
  { name: "school bus", icon: "🚌", zone: "land", sound: "bus", definition: "A bright yellow bus used to transport children to and from school." },
  { name: "police car", icon: "🚓", zone: "land", sound: "police-car", definition: "An emergency vehicle used by police officers for patrol and response." },
  { name: "ambulance", icon: "🚑", zone: "land", sound: "ambulance", definition: "An emergency vehicle equipped to take sick or injured people to the hospital." },
  { name: "fire engine", icon: "🚒", zone: "land", sound: "fire-engine", definition: "A heavy vehicle carrying firefighters and equipment to put out fires." },
  { name: "tractor", icon: "🚜", zone: "land", sound: "tractor", definition: "A powerful vehicle used on farms to pull equipment and plow fields." },
  { name: "rickshaw", icon: "🛺", zone: "land", sound: "rickshaw", definition: "A small two- or three-wheeled cart pulled by a person or a bicycle." },
  { name: "skateboard", icon: "🛹", zone: "land", sound: "skateboard", definition: "A short board with four small wheels ridden for fun or short trips." },
  { name: "boat", icon: "🚤", zone: "water", sound: "boat", definition: "A small watercraft used for traveling on rivers, lakes, or coastal areas." },
  { name: "ship", icon: "🚢", zone: "water", sound: "ship", definition: "A large watercraft used for ocean travel and carrying heavy cargo." },
  { name: "ferry", icon: "⛴️", zone: "water", sound: "ship", definition: "A boat that carries passengers, vehicles, and goods across a body of water." },
  { name: "speedboat", icon: "🚤", zone: "water", sound: "speedboat", definition: "A fast motorboat designed for high speeds on water." },
  { name: "yacht", icon: "🛥️", zone: "water", sound: "boat", definition: "A luxury boat used for cruising, recreation, or racing." },
  { name: "jet ski", icon: "", zone: "water", sound: "jet-ski", definition: "A small, personal watercraft driven by a jet pump." },
  { name: "airplane", icon: "✈️", zone: "air", sound: "airplane", definition: "A powered flying vehicle with fixed wings for long-distance travel." },
  { name: "helicopter", icon: "🚁", zone: "air", sound: "helicopter", definition: "An aircraft with rotating blades that can take off and land vertically." },
  { name: "hot air balloon", icon: "🎈", zone: "air", sound: "hot-air-balloon", definition: "A large balloon filled with heated air to lift a basket for flight." },
  { name: "glider", icon: "🛩️", zone: "air", sound: "wind", definition: "A lightweight aircraft that flies without an engine using air currents." },
  { name: "space shuttle", icon: "🚀", zone: "air", sound: "rocket", definition: "A spacecraft that launches into space and can return to Earth." }
];


const listeningVehicles = vehicles.filter(vehicle => vehicle.sound);

const safetyQuestions = [
  { q: "What should you wear in a car?", icon: "🚗", answers: [["A seat belt", "✅"], ["A swimming ring", "🛟"], ["Roller skates", "🛼"]], correct: 0, explain: "Click! A seat belt helps keep you safe." },
  { q: "What should you wear on a bicycle?", icon: "🚲", answers: [["A helmet", "⛑️"], ["A party hat", "🥳"], ["Slippers", "🩴"]], correct: 0, explain: "A helmet protects your head." },
  { q: "The traffic light is red. What do we do?", icon: "🔴", answers: [["Stop", "✋"], ["Go fast", "💨"], ["Dance", "💃"]], correct: 0, explain: "Red means stop and wait." },
  { q: "Before crossing the road, what do we do?", icon: "🚸", answers: [["Stop, look, and listen", "👀"], ["Run without looking", "🏃"], ["Close our eyes", "🙈"]], correct: 0, explain: "Stop, look both ways, and listen." },
  { q: "What keeps you safe on a boat?", icon: "🚤", answers: [["A life jacket", "🦺"], ["A winter scarf", "🧣"], ["A school bag", "🎒"]], correct: 0, explain: "Wear a life jacket near or on the water." },
  { q: "Where should you sit on a moving bus?", icon: "🚌", answers: [["On a seat", "💺"], ["On the steps", "🪜"], ["On the roof", "🏠"]], correct: 0, explain: "Sit properly and hold on when needed." },
  { q: "When can we walk behind a reversing car?", icon: "🚙", answers: [["Only when it has stopped and an adult says it is safe", "🛑"], ["Whenever we want", "🤷"], ["When it is moving", "↩️"]], correct: 0, explain: "Wait until the car stops and an adult says it is safe." },
  { q: "Where is the safest place to cross?", icon: "🦓", answers: [["At a pedestrian crossing", "🚸"], ["Between parked cars", "🚘"], ["Around a blind corner", "↪️"]], correct: 0, explain: "Use a pedestrian crossing with an adult." }
];

TransportCurriculum.prepare(vehicles, safetyQuestions);
TransportStandard.prepare(vehicles);
// Painted Field Guide pictures are transparent, so the same picture also gives the silhouette clue.
for(const vehicle of vehicles)vehicle.cutout=vehicle.image;
const transportWords=[...vehicles,...(globalThis.TransportSceneLibrary?.entries||[])];
const classroom = new TransportClassroom({entries:transportWords,questions:safetyQuestions,curriculum:TransportCurriculum});
let activeSession = null;

const zones = [
  { name: "Land", icon: "🛣️", iconImage: "images/vocabulary/vehicle.car.png", value: "land" },
  { name: "Water", icon: "🌊", iconImage: "images/vocabulary/vehicle.boat.png", value: "water" },
  { name: "Air", icon: "☁️", iconImage: "images/vocabulary/vehicle.airplane.png", value: "air" }
];

const modeInfo = {
  learn: { badge: "VOCABULARY", title: "What is this?", helper: "" },
  sort: { badge: "SORTING", title: "Where does the {vehicle} travel?", helper: "" },
  detective: { badge: "TRANSPORT DETECTIVE", title: "What is in the hidden picture?", helper: "" },
  identify: { badge: "WHICH ONE IS IT?", title: "", helper: "" },
  safety: { badge: "ROAD SAFETY", title: "", helper: "" },
  hangman: { badge: "TRANSPORT SPELLING", title: "", helper: "" },
  flip: { badge: "FLIP THE TILES", title: "", helper: "" },
  wheel: { badge: "SPIN THE WHEEL", title: "", helper: "" }
};

const screens = {
  home: document.getElementById("homeScreen"),
  game: document.getElementById("gameScreen"),
  results: document.getElementById("resultsScreen")
};
const els = {
  modeBadge: document.getElementById("modeBadge"), question: document.getElementById("questionText"),
  helper: document.getElementById("questionHelper"), emoji: document.getElementById("vehicleEmoji"),
  name: document.getElementById("vehicleName"), answers: document.getElementById("answers"),
  feedback: document.getElementById("feedback"), round: document.getElementById("roundLabel"),
  progress: document.getElementById("progressFill"), score: document.getElementById("scoreValue"),
  stage: document.getElementById("vehicleStage"), listen: document.getElementById("listenBtn"), emojiToggle: document.getElementById("emojiToggle"),
  sound: document.getElementById("soundBtn"), finalScore: document.getElementById("finalScore"),
  totalQuestions: document.getElementById("totalQuestions"), definition: document.getElementById("vehicleDefinition"),
  stars: document.getElementById("bigStars"), resultMessage: document.getElementById("resultMessage"),
  confetti: document.getElementById("confetti"), scorePill: document.getElementById("scorePill"), hangmanWin: document.getElementById("hangmanWinEmojis"), hangmanSadRain: document.getElementById("hangmanSadRain")
};

let state = { mode: null, round: 0, score: 0, questions: [], answered: false, wrongThisRound: false, muted: false, identifyEmojis: true };
let audioCtx;
let activeClip;
let wheelTickTimers = [];
let promptTask;
let confettiTask;
let speechHeld = false;
let detectiveView=null;
let spellingScene=null;
let wheelTween=null;
const activeEffects = new Set();
const landingScene = new TransportLanding(document.querySelector('.backdrop'));
const work = new TransportLifecycle({ onHold: held => {
  globalThis.TransportPhonics?.setPaused(held);
  globalThis.TransportDispatch?.setHeld(held);
  globalThis.TransportDriving?.setHeld(held);
  detectiveView?.setHeld(held);
  spellingScene?.setHeld(held);
  wheelTween?.paused(held);
  landingScene.setHold('activity', held);
  if (activeClip) {
    if (held) activeClip.pause();
    else if (!state.muted && !activeClip.ended) activeClip.play().catch(() => {});
  }
  if ("speechSynthesis" in window) {
    if (held) {
      speechHeld = speechSynthesis.speaking && !speechSynthesis.paused;
      if (speechHeld) speechSynthesis.pause();
    } else if (speechHeld) {
      speechHeld = false;
      if (!state.muted && speechSynthesis.paused) speechSynthesis.resume();
    }
  }
  if (held) audioCtx?.suspend().catch(() => {});
  else if (!state.muted) audioCtx?.resume().catch(() => {});
} });

function cancelCurrentWork() {
  globalThis.TransportPhonics?.destroy();
  globalThis.TransportDispatch?.destroy();
  globalThis.TransportDriving?.destroy();
  detectiveView?.destroy();detectiveView=null;
  spellingScene?.destroy();spellingScene=null;
  wheelTween?.kill();wheelTween=null;
  work.cancel();
  wheelTickTimers = [];
  promptTask = confettiTask = null;
  stopSpeech();
  for (const source of activeEffects) {
    try { source.stop(); } catch (_) {}
    source.disconnect();
  }
  activeEffects.clear();
  els.confetti.replaceChildren();
  for (const animation of screens.game.getAnimations({ subtree: true })) animation.cancel();
}

function ownEffect(source) {
  activeEffects.add(source);
  source.addEventListener("ended", () => {
    activeEffects.delete(source);
    source.disconnect();
  }, { once: true });
}
const SCOOPS_PER_CONE = 5;
const MAX_SPELLING_MISSES = 8;

function shuffled(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
  const launch = name === 'home' && !screens.home.classList.contains('menu-open');
  document.body.dataset.screen = launch ? 'launch' : name === 'home' ? 'menu' : name;
  landingScene.setActive(launch);
}

// Recorded narration (Amazon Polly, Amy, neural, en-GB). Texts without a recording use the device voice.
let narrationManifest = null;
let speakGeneration = 0;
function narrationClips() {
  narrationManifest ||= fetch("audio/narration-manifest.json")
    .then(r => r.ok ? r.json() : { clips: {} })
    .then(m => (m.voice === "Amy" && m.engine === "neural" && m.locale === "en-GB" ? m.clips : {}) || {})
    .catch(() => { narrationManifest = null; return {}; });
  return narrationManifest;
}
narrationClips(); // Load early so the first tap plays straight away.

function stopSpeech() {
  speakGeneration++;
  speechHeld = false;
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  if (activeClip) { activeClip.pause(); activeClip = null; }
}

function speak(text) {
  work.cancelTask(promptTask);
  if (state.muted || work.held || !text) return;
  stopSpeech();
  const generation = speakGeneration;
  narrationClips().then(clips => {
    if (generation !== speakGeneration || state.muted || work.held) return;
    const path = clips[text];
    if (!/^audio\/polly\/[a-f0-9]{64}\.mp3$/.test(path || "")) { speakWithDevice(text); return; }
    const clip = new Audio(path);
    activeClip = clip;
    clip.onended = () => { if (activeClip === clip) activeClip = null; };
    clip.play().catch(() => { if (generation === speakGeneration && activeClip === clip) { activeClip = null; speakWithDevice(text); } });
  });
}

function speakWithDevice(text) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = .82;
  utterance.pitch = 1.05;
  utterance.lang = "en-GB";
  speechSynthesis.speak(utterance);
}

function getAudio() {
  audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
  return audioCtx;
}

function tone(freq, start, duration, type = "sine", volume = .12) {
  if (state.muted || work.held) return;
  const ctx = getAudio();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
  gain.gain.setValueAtTime(0.001, ctx.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + start + .02);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
  osc.connect(gain).connect(ctx.destination);
  ownEffect(osc);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + duration + .03);
}

function noise(start, duration, volume = .07) {
  if (state.muted || work.held) return;
  const ctx = getAudio();
  const length = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
  const source = ctx.createBufferSource();
  const gain = ctx.createGain();
  gain.gain.value = volume;
  source.buffer = buffer;
  source.connect(gain).connect(ctx.destination);
  ownEffect(source);
  source.start(ctx.currentTime + start);
}

function wheelTick() {
  tone(1100, 0, .025, "square", .035);
}

function scheduleWheelTicks(duration = 4200) {
  wheelTickTimers.forEach(timer => work.cancelTask(timer));
  wheelTickTimers = [];
  const tickCount = 34;
  const weights = Array.from({ length: tickCount }, (_, index) => 1 + 7 * (index / (tickCount - 1)) ** 2);
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let elapsed = 0;
  wheelTick();
  weights.forEach((weight, index) => {
    elapsed += duration * weight / totalWeight;
    if (index === tickCount - 1) return;
    wheelTickTimers.push(work.schedule(() => {
      if (state.mode === "wheel" && state.wheel?.spinning) wheelTick();
    }, elapsed));
  });
}

// Part, place and action pictures often show a whole vehicle, so choices come from the same kind of word first.
const wordKind=item=>['land','water','air','space'].includes(item.category)?'vehicle':item.category;
function identifyChoices(vehicle,pool=classroom.pool('identify')) {
  const choices = [vehicle];
  const kind=wordKind(vehicle),mixed=shuffled(pool);
  for (const candidate of [...mixed.filter(item=>wordKind(item)===kind),...mixed.filter(item=>wordKind(item)!==kind)]) {
    if(choices.length===3)break;
    if(choices.every(choice=>choice.id!==candidate.id&&choice.pictureGroup!==candidate.pictureGroup))choices.push(candidate);
  }
  return shuffled(choices);
}

function withArticle(name) {
  return /^[aeiou]/i.test(name) ? `an ${name}` : `a ${name}`;
}

function identifyQuestion(choices) {
  const names=choices.map(choice=>withArticle(choice.name));
  return names.length===1?`Practise the word: ${choices[0].name}`:names.length===2?`Is it ${names[0]} or ${names[1]}?`:`Is it ${names[0]}, ${names[1]}, or ${names[2]}?`;
}

function startGame(mode, {fresh=false,setup=null}={}) {
  mode=mode==='sound'?'detective':mode;
  rememberAttempt(true);cancelCurrentWork();activeSession=null;
  if(TransportStandard.hubs[mode]){renderStandardHub(mode);return;}
  if(mode==='flip'){
    state={...state,mode,round:0,score:0,questions:[],answered:false,wrongThisRound:false,flip:null,wheel:null,completedIds:[],sessionKey:null,choosing:true,setup:{}};
    showScreen('game');renderQuestion();return;
  }
  if(!setup&&['learn','wheel'].includes(mode)){renderStandardCategories(mode);return;}
  if(!setup&&mode==='sort'){renderStandardSortRules();return;}
  if(!setup&&mode==='detective'){renderStandardDetectiveSetup();return;}
  setup=setup||{};
  const session=standardSession(mode,setup);
  if(!session.pool.length){showScopeRecovery(mode);return;}
  if(mode==='sort'&&TransportStandard.availableGroups(TransportStandard.ruleFor(setup.rule),session.pool).length<2){showScopeRecovery(mode,'This sorting rule needs words in at least two of its groups. Change the selection or choose another rule.');return;}
  if(mode==='detective'&&new Set(session.pool.map(i=>i.pictureGroup)).size<2){showScopeRecovery(mode,'Detective needs at least two distinct teaching pictures. Change the selection or reveal type.');return;}
  if(session.invalidated&&!fresh){showScopeRecovery(mode,'The saved activity no longer matches the available content. Choose how to continue.',true);return;}
  if(!fresh&&restoreAttempt(session))return;
  if(fresh)classroom.discard(session.key);
  activeSession=session;
  const reserved=classroom.reserve(session,mode==='safety'?7:mode==='wheel'?12:mode==='learn'?12:10);
  let questions=reserved;
  if(mode==='identify'||mode==='detective')questions=reserved.map(vehicle=>({vehicle,choices:identifyChoices(vehicle,session.pool),...(mode==='detective'?{reveal:TransportReveal.create(setup.kind,setup.duration,shuffled(Array.from({length:120},(_,i)=>i)))}:{})}));
  if(mode==='hangman')questions=reserved.map(vehicle=>({vehicle,guessed:[],misses:0,sadConeIndex:null,awarded:false,assisted:false}));
  if(mode==='safety')questions=reserved.map(q=>({...q,answerOrder:shuffled(q.answerIds)}));
  if(!questions.length){showScopeRecovery(mode,'No unplayed words are available in this activity cycle.',true);return;}
  state={...state,mode,round:0,score:0,questions,answered:false,wrongThisRound:false,flip:null,practice:['learn','wheel'].includes(mode)||session.pool.length<2&&mode==='identify',completedIds:[],sessionKey:session.key,choosing:false,setup,wheel:mode==='wheel'?{remaining:[...questions],selected:null,landing:null,spinning:false,returning:false}:null};
  showScreen('game');renderQuestion();rememberAttempt();
}

function questionId(item) { return item?.vehicle?.id||item?.id; }

function completeQuestion(id=questionId(state.questions[state.round])) {
  if(!activeSession||!id)return;
  classroom.complete(activeSession.key,id);
  state.completedIds=[...new Set([...(state.completedIds||[]),id])];
}

function rememberAttempt(release=false) {
  if(!activeSession||!screens.game.classList.contains('active')||state.recovery)return;
  detectiveView?.flush();
  const snapshot=JSON.parse(JSON.stringify(state,(_key,value)=>value?.id&&value.eligibility?{$vehicle:value.id}:value));
  if(snapshot.wheel){
    snapshot.wheel.selected=snapshot.wheel.selected||snapshot.wheel.landing||snapshot.wheel.pending||null;
    snapshot.wheel.spinning=false;snapshot.wheel.landing=null;snapshot.wheel.pending=null;snapshot.wheel.returning=false;
  }
  if(snapshot.mode==='hangman')for(const round of snapshot.questions){round.sadConeIndex=null;round.winCelebration=false;}
  const ui={disabledChoiceIds:[...els.answers.querySelectorAll('.answer-btn.wrong')].map(button=>button.dataset.choiceId).filter(Boolean),feedbackText:els.feedback.querySelector('p')?.textContent||''};
  classroom.save(activeSession,{state:snapshot,ui});
  if(release){classroom.release(activeSession.key);activeSession=null;}
}

function restoreAttempt(session) {
  const saved=classroom.restore(session);if(!saved)return false;
  try{
    const map=new Map(transportWords.map(item=>[item.id,item]));
    const restored=JSON.parse(JSON.stringify(saved.state),(_key,value)=>{
      if(value&&Object.hasOwn(value,'$vehicle')){if(!map.has(value.$vehicle))throw Error('Unknown word');return map.get(value.$vehicle);}return value;
    });
    const mode=JSON.parse(session.key)[0],ids=restored.questions?.map(questionId);
    if(restored.mode!==mode||!ids?.length||new Set(ids).size!==ids.length||ids.some(id=>!session.pool.some(item=>item.id===id))||!Number.isInteger(restored.round)||restored.round<0||restored.round>=ids.length||!Number.isInteger(restored.score)||restored.score<0||restored.score>ids.length)throw Error('Invalid attempt');
    if(!Array.isArray(restored.completedIds)||restored.completedIds.some(id=>!ids.includes(id)))throw Error('Invalid progress');
    if(['identify','detective'].includes(mode)&&restored.questions.some(item=>!Array.isArray(item.choices)||!item.choices.length||new Set(item.choices.map(c=>c.id)).size!==item.choices.length||!item.choices.some(c=>c.id===item.vehicle.id)||item.choices.some(c=>!session.pool.some(p=>p.id===c.id))))throw Error('Invalid choices');
    if(mode==='detective'&&restored.questions.some(item=>!TransportReveal.valid(item.reveal)))throw Error('Invalid reveal');
    if(mode==='hangman'&&restored.questions.some(item=>!Array.isArray(item.guessed)||item.guessed.some(l=>!(/^[a-z]$/).test(l))||new Set(item.guessed).size!==item.guessed.length||!Number.isInteger(item.misses)||item.misses<0||item.misses>8))throw Error('Invalid spelling progress');
    if(mode==='safety'){
      restored.questions=restored.questions.map(item=>{const canonical=safetyQuestions.find(q=>q.id===item.id);if(!canonical||!Array.isArray(item.answerOrder)||new Set(item.answerOrder).size!==canonical.answerIds.length||item.answerOrder.some(id=>!canonical.answerIds.includes(id)))throw Error('Invalid safety choices');return {...canonical,answerOrder:item.answerOrder};});
    }
    if(mode==='flip'&&(!restored.flip||!Array.isArray(restored.flip.tiles)||restored.flip.tiles.length!==ids.length*2||restored.flip.tiles.some(t=>!ids.includes(t.vehicle?.id))))throw Error('Invalid matching board');
    if(mode==='wheel'&&(!restored.wheel||!Array.isArray(restored.wheel.remaining)||restored.wheel.remaining.some(v=>!ids.includes(v.id))))throw Error('Invalid wheel');
    const pending=ids.filter(id=>!restored.completedIds.includes(id));
    if(!classroom.claim(session,pending))throw Error('Reservation changed');
    const muted=state.muted;state={...restored,muted,recovery:false};activeSession=session;
    state.choosing=false;state.setup=state.setup||TransportStandard.setupFor(mode,JSON.parse(session.key)[4]);
    if(['learn','wheel'].includes(mode))state.practice=true;
    const answered=Boolean(state.answered),wrong=Boolean(state.wrongThisRound);
    showScreen('game');renderQuestion();work.cancelTask(promptTask);
    state.answered=answered;state.wrongThisRound=wrong;
    if(mode==='hangman')renderHangman();
    if(['sort','identify','safety'].includes(mode)&&!state.practice){
      for(const button of els.answers.querySelectorAll('.answer-btn')){
        const previous=saved.ui?.disabledChoiceIds||[];
        const previouslyWrong=previous.includes(button.dataset.choiceId)||previous.includes(button.textContent.trim());
        button.disabled=answered||previouslyWrong;
        button.classList.toggle('wrong',previouslyWrong&&button.dataset.correct!=='true');
        button.classList.toggle('correct',answered&&button.dataset.correct==='true');
      }
    }
    if(answered&&mode!=='wheel'){
      els.feedback.replaceChildren();els.feedback.className='feedback is-correct';
      const message=saved.ui?.feedbackText||(mode==='safety'?state.questions[state.round].explain:'');
      if(message){const p=document.createElement('p');p.textContent=message;els.feedback.append(p);}
      const next=document.createElement('button');next.className='next-btn';next.id='nextBtn';next.textContent=mode==='flip'?'Finish game':'Next';
      next.onclick=mode==='flip'?finishGame:nextQuestion;els.feedback.append(next);
    }
    rememberAttempt();return true;
  }catch{
    classroom.discard(session.key);
    showScopeRecovery(JSON.parse(session.key)[0],'The saved activity could not be restored safely. Start a new session with this selection.',true);
    return true;
  }
}

function showScopeRecovery(mode,message='No eligible content matches this selection.',canRestart=false) {
  cancelCurrentWork();activeSession=null;
  state={...state,mode,questions:[],round:0,score:0,recovery:true,sessionKey:null};
  showScreen('game');
  clearVehiclePicture();els.stage.style.display='none';els.emojiToggle.hidden=true;els.listen.disabled=true;
  els.modeBadge.textContent=modeInfo[mode]?.badge||'Transport';els.question.textContent='Choose content for this activity';els.helper.textContent='';
  els.round.textContent='';els.progress.style.width='0%';els.scorePill.hidden=true;els.feedback.replaceChildren();
  const panel=document.createElement('div');panel.className='scope-recovery';
  const text=document.createElement('p');text.textContent=message;
  const selection=document.createElement('p');selection.textContent=TransportCurriculum.scopeLabel(classroom.scope);
  const actions=document.createElement('div');actions.className='recovery-actions';
  const add=(label,action)=>{const button=document.createElement('button');button.textContent=label;button.onclick=action;actions.append(button);};
  add('Change selection',()=>document.getElementById('teacherBtn').click());
  add('Show all Transport words',()=>{classroom.apply({});refreshTeacherButton();startGame(mode,{fresh:true});});
  if(classroom.words().length)add('Practise these words',()=>startGame('learn'));
  if(canRestart)add('Start a new session',()=>startGame(mode,{fresh:true}));
  panel.append(text,selection,actions);els.answers.replaceChildren(panel);
}

function renderQuestion() {
  cancelCurrentWork();
  document.querySelector('.picture-controls')?.remove();document.getElementById('gameCard').classList.remove('hide-identify-target');
  state.recovery=false;els.stage.style.display='';els.listen.disabled=false;els.scorePill.hidden=false;
  els.listen.hidden=false;document.querySelector('.progress-track').hidden=false;setStandardBack('Games');
  const gameCard = document.getElementById("gameCard");
  gameCard.dataset.mode = state.mode;
  gameCard.classList.toggle("hide-answer-emojis", state.mode === "identify" && !state.identifyEmojis);
  state.answered = false;
  state.wrongThisRound = false;
  const total = state.questions.length;
  els.feedback.textContent = "";
  els.feedback.className = "feedback";
  els.hangmanWin.hidden = true;
  els.hangmanSadRain.hidden = true;
  const longRound = state.mode === "sort" || state.mode === "sound" || state.mode === "identify" || state.mode === "hangman";
  els.round.textContent = `Round ${state.round + 1}/${total}`;
  els.progress.style.width = `${(state.round / total) * 100}%`;
  els.score.textContent = state.score;
  els.answers.innerHTML = "";
  els.definition.textContent = "";
  els.definition.classList.remove("visible");
  els.emoji.style.animation = "none";
  void els.emoji.offsetWidth;
  els.emoji.style.animation = "";

  const info = modeInfo[state.mode];
  els.modeBadge.textContent = info.badge;
  els.helper.textContent = info.helper;
  els.listen.textContent = "Listen";
  els.emojiToggle.hidden = true;
  els.emojiToggle.textContent = state.identifyEmojis ? "🙈" : "🖼️";
  els.emojiToggle.title = state.identifyEmojis ? "Hide answer pictures" : "Show answer pictures";
  els.emojiToggle.setAttribute("aria-label", els.emojiToggle.title);

  if (state.mode === "flip") {
    if(state.flip)renderFlipGame();else renderFlipSetup();
    return;
  }
  if(state.mode==='detective'){renderStandardDetective();return;}
  if (state.mode === "wheel") {
    renderWheel();
    return;
  }

  if (state.mode === "safety") renderSafety();
  else if (state.mode === "learn") renderLearn();
  else if (state.mode === "sort") renderSort();
  else if (state.mode === "identify") renderIdentify();
  else if (state.mode === "hangman") renderHangman();
  else renderSound();

  // Teaching speech is explicit through Listen/Hear controls, never automatic on entry.
}

function renderFlipSetup() {
  const pool=classroom.pool('flip');
  if(pool.length<2){showScopeRecovery('flip','Matching needs at least two different words. Change the selection or practise these words in Meet the Words.');return;}
  clearVehiclePicture();
  els.emoji.textContent = "🃏";
  els.name.textContent = "MATCHING GAME";
  els.stage.dataset.sound = "";
  els.question.textContent = "Choose your matching game";
  els.round.textContent = "";
  els.scorePill.hidden=true;els.listen.hidden=true;els.stage.style.display='none';document.querySelector('.progress-track').hidden=true;setStandardBack('Games');
  els.progress.style.width = "0%";
  els.answers.innerHTML = `<div class="flip-setup"><div class="flip-choice-row"><button class="flip-choice" data-count="10">10 words<span>20 tiles</span></button><button class="flip-choice" data-count="20">20 words<span>40 tiles</span></button><button class="flip-choice" data-count="30">30 words<span>60 tiles</span></button></div></div>`;
  els.answers.querySelectorAll("[data-count]").forEach(button => {
    const limit=Number(button.dataset.count),session=classroom.prepare('flip',classroom.scope,`pairs:${limit}`);
    const available=session.cycle.remaining.length||session.pool.length;
    const count=Math.min(limit,available);
    // Plants pattern: a stacked tile pair picture, "Up to N words" and the tile count.
    const strong=document.createElement('strong');strong.textContent=`Up to ${limit} words`;
    const detail=document.createElement('span');detail.className='flip-choice-count';detail.textContent=`${count*2} tiles${count===1?' · practice':''}`;
    button.replaceChildren(strong,detail);
    button.addEventListener('click',()=>startFlipGame(limit));
  });
  illustrateFlipChoices();
}

function startFlipGame(vocabularyCount) {
  const session=classroom.prepare('flip',classroom.scope,`pairs:${vocabularyCount}`);
  if(restoreAttempt(session))return;
  activeSession=session;
  const vocabulary=classroom.reserve(session,vocabularyCount);
  const tiles = shuffled(vocabulary.flatMap((vehicle, pairIndex) => [
    { id: `${pairIndex}-a`, vehicle, flipped: false, matched: false },
    { id: `${pairIndex}-b`, vehicle, flipped: false, matched: false }
  ]));
  state.questions = vocabulary;
  state.sessionKey=session.key;state.completedIds=[];state.practice=vocabulary.length<2;
  state.choosing=false;state.setup={flipCount:vocabularyCount};setStandardBack('Matching choices');
  state.flip = { tiles, firstTileId: null, locked: false, matches: 0, turns: 0 };
  state.score = 0;
  renderFlipGame();
  rememberAttempt();
}

function renderFlipGame() {
  setStandardBack('Matching choices');els.stage.style.display='none';els.listen.hidden=true;els.scorePill.hidden=false;document.querySelector('.progress-track').hidden=false;
  const { tiles, matches } = state.flip;
  clearVehiclePicture();
  els.emoji.textContent = "";
  els.name.textContent = "";
  els.stage.dataset.sound = "";
  els.question.textContent = "";
  els.round.textContent = `Matches ${matches}/${state.questions.length}`;
  els.progress.style.width = `${(matches / state.questions.length) * 100}%`;
  els.score.textContent = matches;
  if (!els.answers.querySelector(".flip-board")) {
  els.answers.innerHTML = `<div class="flip-board flip-board-${tiles.length}" aria-label="Vocabulary matching tiles">${tiles.map((tile, index) => `<button class="flip-tile ${tile.flipped || tile.matched ? "flipped" : ""} ${tile.matched ? "matched" : ""}" data-tile-id="${tile.id}" data-tile-number="${index + 1}" ${tile.matched ? "disabled" : ""} aria-label="${tile.flipped || tile.matched ? tile.vehicle.name : `Tile ${index + 1}`}"><span class="flip-tile-inner"><span class="flip-tile-back">${index + 1}</span><span class="flip-tile-front"><img src="${vehicleEmojiPath(tile.vehicle)}" alt=""><strong>${tile.vehicle.name}</strong></span></span></button>`).join("")}</div><p class="flip-turns" aria-live="polite"></p>`;
  els.answers.querySelectorAll("[data-tile-id]").forEach(tile => tile.addEventListener("click", () => flipTile(tile.dataset.tileId)));
  }
  els.answers.querySelector(".flip-turns").textContent = `Turns: ${state.flip.turns || 0}`;
  for (const tile of tiles) {
    const button = els.answers.querySelector(`[data-tile-id="${tile.id}"]`);
    button.classList.toggle("flipped", tile.flipped || tile.matched);
    button.classList.toggle("matched", tile.matched);
    button.disabled = tile.matched;
    button.setAttribute("aria-label", tile.flipped || tile.matched ? tile.vehicle.name : `Tile ${button.dataset.tileNumber}`);
    button.querySelector(".flip-tile-front").setAttribute("aria-hidden", String(!tile.flipped && !tile.matched));
    button.querySelector(".flip-tile-back").setAttribute("aria-hidden", String(tile.flipped || tile.matched));
  }
}

function flipTile(tileId) {
  const game = state.flip;
  const tile = game.tiles.find(candidate => candidate.id === tileId);
  if (!tile || tile.flipped || tile.matched) return;
  // A mismatch remains available to compare until the next hidden tile is chosen.
  if (game.mismatch) {
    for (const id of game.mismatch) game.tiles.find(candidate => candidate.id === id).flipped = false;
    game.mismatch = null;
    game.firstTileId = null;
  }
  tile.flipped = true;
  if (!game.firstTileId) {
    game.firstTileId = tileId;
    renderFlipGame();
    return;
  }
  const firstTile = game.tiles.find(candidate => candidate.id === game.firstTileId);
  game.turns = (game.turns || 0) + 1;
  if (firstTile.vehicle.name === tile.vehicle.name) {
    firstTile.matched = tile.matched = true;
    game.matches++;
    completeQuestion(firstTile.vehicle.id);
    state.score = game.matches;
    game.firstTileId = null;
    tone(523, 0, .16); tone(659, .16, .16);
    burstConfetti();
  } else {
    game.mismatch = [firstTile.id, tile.id];
    tone(180, 0, .18, "sine", .08);
  }
  renderFlipGame();
  if (game.matches === state.questions.length) {
    state.answered = true;
    standardFeedback("You found every match!", finishGame, "correct", "See results");
    speak("You found every match!");
  }
}

function wheelColors(count) {
  const colors = ["#ffd54a", "#ff9d7b", "#a4e57b", "#75c9ff", "#c7a8ff", "#ffb6dc"];
  const slice = 360 / count;
  return `conic-gradient(from -90deg, ${Array.from({ length: count }, (_, index) => `${colors[index % colors.length]} ${index * slice}deg ${(index + 1) * slice}deg`).join(", ")})`;
}

function renderWheel() {
  state.practice=true;setStandardBack('Categories');els.listen.hidden=true;els.scorePill.hidden=false;els.helper.textContent='';
  const game = state.wheel;
  const total = state.questions.length;
  const wordsRead = total - game.remaining.length;
  clearVehiclePicture();
  els.emoji.textContent = "";
  els.name.textContent = "";
  els.stage.dataset.sound = "";
  els.question.textContent = "";
  els.round.textContent = `Words ${wordsRead}/${total}`;
  els.progress.style.width = `${(wordsRead / total) * 100}%`;
  els.score.textContent = wordsRead;
  if(renderStandardWheelSelection())return;
  els.stage.style.display='none';
  const count = Math.min(12,game.remaining.length);
  const slice = 360 / count;
  const segmentEmojis = game.remaining.slice(0,count).map((vehicle, index) => {
    const angle = -90 + (index + .5) * slice;
    const radians = angle * Math.PI / 180;
    const x = 50 + 34 * Math.cos(radians);
    const y = 50 + 34 * Math.sin(radians);
    const rotation = game.spinning ? -(game.rotation || 0) : 0;
    return `<span class="wheel-segment-emoji${count>8?' wheel-segment-emoji--small':''}" style="--x:${x}%; --y:${y}%; --segment-angle:${angle}deg; --counter-angle:${-angle}deg; --emoji-rotation:${rotation}deg" aria-hidden="true"><img src="${vehicle.image}" alt=""></span>`;
  }).join("");
  const spinClass = game.spinning ? "spinning" : game.returning ? "returning" : "";
  const landingWord = game.landing ? `<div class="wheel-landing-word">${game.landing.name}</div>` : "";
  els.answers.innerHTML = `<div class="wheel-stage"><div class="wheel-wrap"><div class="vocab-wheel ${spinClass}" style="--wheel-background:${wheelColors(count)}; --wheel-rotation:${game.rotation || 0}deg">${segmentEmojis}<button class="wheel-hub" id="wheelSpinBtn" ${game.spinning || game.landing ? "disabled" : ""} aria-label="${game.spinning ? "Wheel is spinning" : "Spin the wheel"}">${game.spinning ? "…" : "SPIN"}</button></div><div class="wheel-pointer" aria-hidden="true">◀</div>${landingWord}</div></div>`;
  document.getElementById("wheelSpinBtn").onclick = spinWheel;
}

function spinWheel() {
  const game = state.wheel;
  if (game.spinning || !game.remaining.length) return;
  const count=Math.min(12,game.remaining.length);
  const selectedIndex = Math.floor(Math.random() * count);
  const slice = 360 / count;
  game.pending = game.remaining[selectedIndex];
  game.rotation = 2610 - (selectedIndex * slice + slice / 2);
  game.spinning = true;
  game.returning = false;
  renderWheel();
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration=reduced?0:4200;
  const wheel=els.answers.querySelector('.vocab-wheel');
  wheelTween=gsap.fromTo(wheel,{rotation:0},{rotation:game.rotation,duration:duration/1000,ease:'power3.out'});
  if(!reduced)scheduleWheelTicks(duration);
  work.schedule(() => {
    game.spinning = false;
    game.landing = game.pending;
    game.pending = null;
    renderWheel();
    work.schedule(() => {
      game.selected = game.landing;
      game.landing = null;
      renderWheel();
    }, reduced?0:1400);
  }, duration);
}

function nextWheelWord() {
  cancelCurrentWork();
  const game = state.wheel;
  completeQuestion(game.selected.id);
  game.remaining = game.remaining.filter(vehicle => vehicle.id !== game.selected.id);
  game.selected = null;
  state.score++;
  if (!game.remaining.length) {
    finishGame();
    return;
  }
  game.returning = true;
  renderWheel();
  work.schedule(() => {
    if (state.mode === "wheel" && !state.wheel.selected) state.wheel.returning = false;
  }, 450);
}

function vehicleEmojiPath(vehicle) {
  return vehicle.image;
}

function setVehicle(vehicle, showName = true) {
  clearVehiclePicture();
  els.emoji.textContent = "";
  els.emoji.classList.add("vehicle-icon-image");
  els.emoji.style.backgroundImage = `url("${vehicleEmojiPath(vehicle)}")`;
  els.emoji.style.backgroundPosition = "center";
  els.emoji.setAttribute('role','img');els.emoji.setAttribute('aria-label',vehicle.alt);
  fitTeachingSubject(els.emoji,vehicle);
  els.name.textContent = showName ? vehicle.name.toUpperCase() : "?";
  els.stage.dataset.sound = vehicle.sound;
}

function clearVehiclePicture() {
  delete els.emoji.dataset.teachingId;els.emoji.style.backgroundSize='';
  els.emoji.removeAttribute('role');els.emoji.removeAttribute('aria-label');
  els.emoji.classList.remove("vehicle-picture", "vehicle-icon-image", "safety-scene");
  els.emoji.style.backgroundImage = "";
  els.emoji.style.backgroundPosition = "";
}

function setVehiclePicture(vehicle) {
  els.emoji.textContent = "";
  els.emoji.classList.add("vehicle-picture");
  els.emoji.style.backgroundImage = `url("${vehicleEmojiPath(vehicle)}")`;
  els.emoji.style.backgroundPosition = "center";
  els.emoji.setAttribute('role','img');els.emoji.setAttribute('aria-label','Transport picture to identify');
  fitTeachingSubject(els.emoji,vehicle);
  els.name.textContent = "";
  els.stage.dataset.sound = "";
}

function renderLearn() { return renderStandardLearn(); }

function renderSort() { return renderStandardSort(); }

function renderSound() {
  const correct = state.questions[state.round];
  els.question.textContent = "Which vehicle makes this sound?";
  clearVehiclePicture();
  els.emoji.textContent = "👂";
  els.name.textContent = "LISTEN!";
  els.stage.dataset.sound = correct.sound;
  const pool = shuffled(vehicles.filter(v => v.name !== correct.name && v.sound !== correct.sound));
  const choices = shuffled([correct, ...pool.slice(0, 2)]);
  choices.forEach(v => makeAnswer(v.name, v.icon, v.name === correct.name, `It is the ${correct.name}!`, true));
}

function renderIdentify() { return renderStandardIdentify(); }

function renderSafety() { return renderStandardSafety(); }

function hangmanLetters(name) {
  return name.toLowerCase().replace(/[^a-z]/g, "");
}

function showSadConeForThreeSeconds(item, coneIndex) {
  const round = state.round;
  item.sadConeIndex = coneIndex;
  work.schedule(() => {
    if (state.mode === "hangman" && state.round === round && state.questions[round] === item && item.sadConeIndex === coneIndex) {
      item.sadConeIndex = null;
      renderHangman();
    }
  }, 3000);
}

function showHangmanWinSequence(item) {
  const round = state.round;
  work.schedule(() => {
    if (state.mode === "hangman" && state.round === round && state.questions[round] === item && state.answered) {
      item.winCelebration = true;
      renderHangman();
      els.hangmanWin.hidden = false;
      work.schedule(() => {
        if (state.mode === "hangman" && state.round === round && state.questions[round] === item && state.answered) {
          els.hangmanWin.hidden = true;
        }
      }, 3000);
    }
  }, 2500);
}

function showHangmanSadRain(item) {
  const round = state.round;
  els.hangmanSadRain.hidden = false;
  work.schedule(() => {
    if (state.mode === "hangman" && state.round === round && state.questions[round] === item && state.answered) {
      els.hangmanSadRain.hidden = true;
    }
  }, 2500);
}

function renderHangman() { return renderStandardSpelling(); }

function chooseHangmanLetter(letter) {
  if(state.mode!=='hangman'||state.answered||state.recovery||work.held)return;
  const round=state.questions[state.round],result=TransportStandard.guessSpelling(round,letter);if(!result.changed)return;
  if(result.terminal){
    state.answered=true;completeQuestion(round.vehicle.id);
    state.score+=result.reward;
    renderHangman();els.score.textContent=state.score;
    const last=state.round===state.questions.length-1;
    standardFeedback(result.won?`You spelled “${round.vehicle.name}”!`:`The word was “${round.vehicle.name}”. Let’s try another word!`,nextQuestion,result.won?'correct':'try',last?'Finish':'Next word');
    if(result.won)tone(659,0,.18);rememberAttempt();return;
  }
  renderHangman();rememberAttempt();
  // Plants cheers a correct letter in the feedback bar; a wrong letter shows on the keyboard and the lights.
  if(round.guessed.at(-1)&&hangmanLetters(round.vehicle.name).includes(round.guessed.at(-1))){els.feedback.className='feedback is-correct';els.feedback.textContent='Great letter!';}else{els.feedback.className='feedback';els.feedback.textContent='';}
}

function makeAnswer(label, icon, correct, explain, revealVehicle = false, imagePath = "",choiceId=label) {
  const btn = document.createElement("button");
  btn.className = "answer-btn";
  btn.dataset.correct = correct ? "true" : "false";
  btn.dataset.choiceId=choiceId;
  const vehicle = vehicles.find(candidate => candidate.name === label);
  const iconMarkup = imagePath || vehicle
    ? `<img class="answer-image-icon" src="${imagePath || vehicleEmojiPath(vehicle)}" alt="">`
    : icon;
  btn.innerHTML = `<span class="answer-icon">${iconMarkup}</span><span>${label}</span>`;
  btn.onclick = () => chooseAnswer(btn, correct, explain, revealVehicle);
  els.answers.appendChild(btn);
}

function chooseAnswer(btn, correct, explain, revealVehicle) {
  if (state.answered) return;
  if (!correct) {
    state.wrongThisRound = true;
    btn.classList.add("wrong");
    btn.disabled = true;
    els.feedback.className = "feedback is-try";
    els.feedback.textContent = 'Not that one. Try again!';
    tone(180, 0, .18, "sine", .08);
    return;
  }
  state.answered = true;
  completeQuestion();
  if (!state.wrongThisRound) state.score++;
  btn.classList.add("correct");
  [...els.answers.children].forEach(b => b.disabled = true);
  if (revealVehicle) {
    const current = state.questions[state.round];
    const correctVehicle = state.mode === "identify" ? current.vehicle : current;
    if (state.mode === "identify") {
      setVehiclePicture(correctVehicle);
      els.name.textContent = correctVehicle.name.toUpperCase();
    } else {
      setVehicle(correctVehicle, true);
    }
  }
  els.feedback.className = "feedback";
  standardFeedback(`Correct! ${explain}`);
  burstConfetti(28);
  for(const button of document.querySelectorAll('.picture-toggle'))button.disabled=true;
  els.score.textContent = state.score;
  tone(523, 0, .16); tone(659, .16, .16); tone(784, .32, .28);
  document.getElementById("nextBtn").onclick = nextQuestion;
}

function nextQuestion() {
  completeQuestion();
  if (state.round >= state.questions.length - 1) return finishGame();
  state.round++;
  renderQuestion();
}

function currentPrompt() {
  if(state.choosing||state.recovery||TransportStandard.hubs[state.mode]||state.mode==='detective')return '';
  if (state.mode === "safety") return state.questions[state.round].q;
  if (state.mode === "identify") {
    const item = state.questions[state.round];
    return `Find the picture for ${item.vehicle.name}.`;
  }
  if (state.mode === "hangman") return "";
  if (state.mode === "flip") return "";
  if (state.mode === "wheel") return "";
  const v = state.questions[state.round];
  if (state.mode === "learn") return v.example || v.name;
  if (state.mode === "sort") return TransportStandard.ruleFor(state.setup?.rule).prompt(v.name);
  return "Listen carefully. Which vehicle makes this sound?";
}

function speakCurrentPrompt() { speak(currentPrompt()); }

function playCurrentAudio() {
  if(state.recovery)return;
  speakCurrentPrompt();
}

function finishGame() {
  if(activeSession){classroom.discard(activeSession.key);activeSession=null;state.sessionKey=null;}
  cancelCurrentWork();
  const total = state.questions.length;
  els.progress.style.width = "100%";
  els.finalScore.textContent = state.score;
  els.totalQuestions.textContent = total;
  const met = state.mode === 'learn';
  if (met) markLearnGroupMet(state.setup?.category || 'all');
  const ratio = total ? state.score / total : 0, starCount = ratio >= .85 ? 3 : ratio >= .55 ? 2 : 1;
  const practice = state.practice && !met;
  els.stars.textContent = practice || !state.score ? 'Practice complete' : `${starCount} ${starCount === 1 ? 'star' : 'stars'}`;
  document.querySelector('.result-score').hidden = practice;
  els.resultMessage.textContent=state.mode==='learn'?'You met this group of Transport words!':state.mode==='hangman'?'You worked on the departure words.':state.mode==='detective'?'You explored the hidden Transport pictures.':state.mode==='safety'?'Talk together about the safe travel choices.':state.mode==='sort'?'You compared vehicles using the chosen rule.':state.mode==='flip'?'You found the matching word pairs.':state.mode==='wheel'?'You read this group of Transport words!':state.mode==='create'?'You explored this group of reading cards!':`You explored this set of ${total} words.`;
  document.getElementById('playAgainBtn').textContent = met ? 'Next session' : 'Play Again';
  showScreen("results");
  if (state.mode !== "flip") burstConfetti();
}

function burstConfetti(pieceCount = 55) {
  work.cancelTask(confettiTask);
  els.confetti.innerHTML = "";
  const colors = ["#ffd54a", "#ef5b5b", "#37b56c", "#52bff2", "#8b65d8"];
  for (let i = 0; i < pieceCount; i++) {
    const piece = document.createElement("i");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[i % colors.length];
    piece.style.setProperty("--drift", `${Math.random() * 220 - 110}px`);
    piece.style.animationDelay = `${Math.random() * .55}s`;
    els.confetti.appendChild(piece);
  }
  confettiTask = work.schedule(() => els.confetti.innerHTML = "", 2500);
}

function goHome() {
  rememberAttempt(true);
  cancelCurrentWork();
  document.getElementById("homeScreen").classList.remove("menu-open");
  showScreen("home");
  screens.home.setAttribute('aria-labelledby', 'homeTitle');
  focusLandingHeading('homeTitle');
}

function goMenu() {
  goHome();
  openGameMenu();
}

function openGameMenu() {
  document.getElementById("homeScreen").classList.add("menu-open");
  document.body.dataset.screen = 'menu';
  screens.home.setAttribute('aria-labelledby', 'menuTitle');
  landingScene.setActive(false);
  markContinuingModes();
  focusLandingHeading('menuTitle');
}

// Plants menu: a small Continue tag on any activity with a saved, unfinished attempt for the current word choice.
function markContinuingModes() {
  const base = mode => JSON.parse(classroom.base(mode)).slice(0, 4).join('|');
  const saved = new Set(Object.keys(classroom.data.attempts || {}).map(key => { try { return JSON.parse(key).slice(0, 4).join('|'); } catch { return ''; } }));
  for (const card of document.querySelectorAll('.mode-card')) {
    const text = card.querySelector('.mode-text');
    text.querySelector('.mode-card__status')?.remove();
    if (saved.has(base(card.dataset.mode))) { const tag = document.createElement('small'); tag.className = 'mode-card__status'; tag.textContent = 'Continue'; text.append(tag); }
  }
}

function focusLandingHeading(id) {
  const heading = document.getElementById(id);
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'instant' });
}

const landingTeacher = document.getElementById('landingTeacher');
const reducedControl = document.getElementById('reduceLandingMotion');
let teacherDraft=TransportCurriculum.normaliseScope(classroom.scope);
function refreshTeacherButton(){
  const button=document.getElementById('teacherBtn');button.title=`Teacher settings: ${TransportCurriculum.scopeLabel(classroom.scope)}`;
  button.dataset.filtered=String(Object.values(classroom.scope).some(value=>value!=='all'));
}
function renderTeacherDraft(focusKey){
  const fields=document.getElementById('teacherScopeFields');fields.replaceChildren();
  for(const [key,options] of Object.entries(TransportCurriculum.choices)){
    const label=document.createElement('label');label.append(document.createTextNode(key[0].toUpperCase()+key.slice(1)));
    const select=document.createElement('select');select.dataset.scope=key;select.setAttribute('aria-label',key[0].toUpperCase()+key.slice(1));
    const count=value=>classroom.words({...teacherDraft,[key]:value}).length;
    const all=document.createElement('option');all.value='all';all.textContent=`All ${key==='collection'?'collections':key+'s'} (${count('all')})`;select.append(all);
    for(const option of options){const item=document.createElement('option');item.value=option.id;item.textContent=`${option.label} (${count(option.id)})`;select.append(item);}
    select.value=teacherDraft[key];select.onchange=()=>{teacherDraft={...teacherDraft,[key]:select.value};renderTeacherDraft(key);};
    label.append(select);fields.append(label);
  }
  const words=classroom.words(teacherDraft),questions=classroom.pool('safety',teacherDraft);
  document.getElementById('teacherScopeSummary').textContent=`${words.length} ${words.length===1?'word':'words'} · ${questions.length} safety questions · ${TransportCurriculum.scopeLabel(teacherDraft)}${words.length?'':'. Change a choice or clear the selection.'}`;
  document.getElementById('teacherStorageStatus').textContent=classroom.notice||(classroom.persistent?'Selection and interrupted activities are saved in this browser on this device.':'Progress is available in this tab only.');
  if(focusKey)fields.querySelector(`[data-scope="${focusKey}"]`).focus();
}
document.getElementById('teacherBtn').addEventListener('click', () => {
  teacherDraft=TransportCurriculum.normaliseScope(classroom.scope);renderTeacherDraft();
  renderStandardTeacher();
  reducedControl.checked = landingScene.reduced;
  landingTeacher.showModal();
  work.setHold('teacher', true);
  document.getElementById('teacherBtn').setAttribute('aria-expanded','true');
  document.querySelector('[data-scope="level"]').focus();
});
document.getElementById('closeLandingTeacher').addEventListener('click', () => landingTeacher.close());
landingTeacher.addEventListener('close', () => {work.setHold('teacher', false);document.getElementById('teacherBtn').setAttribute('aria-expanded','false');refreshTeacherButton();});
document.getElementById('clearTeacherScope').addEventListener('click',()=>{teacherDraft=TransportCurriculum.normaliseScope();renderTeacherDraft('level');});
document.getElementById('applyTeacherScope').addEventListener('click',()=>{
  const changed=JSON.stringify(teacherDraft)!==JSON.stringify(classroom.scope);
  if(changed){goMenu();classroom.apply(teacherDraft);}
  applyStandardTeacher();
  landingScene.setReduced(reducedControl.checked);
  landingTeacher.close();refreshTeacherButton();
});
refreshTeacherButton();

// Miniature World menu tiles (artwork/menu/miniature-world-v1, approved 2026-11-09), runtime copies in images/menu.
const menuArt = {learn:'meet-the-words',sort:'sort-it',detective:'transport-detective',identify:'which-one-is-it',safety:'knowledge-and-safety',hangman:'transport-spelling',flip:'flip-the-tiles',wheel:'spin-the-wheel',media:'media',games:'transport-games',phonics:'phonics-and-sight-words',create:'read-draw-and-talk'};
for (const card of document.querySelectorAll('.mode-card')) {
  const image = document.createElement('img');
  image.src = `images/menu/${menuArt[card.dataset.mode]}.webp`;
  image.draggable = false;
  image.alt = '';
  card.querySelector('.mode-icon').replaceChildren(image);
}
landingScene.setActive(true);

document.querySelectorAll(".mode-card").forEach(btn => btn.addEventListener("click", () => startGame(btn.dataset.mode)));
document.getElementById('featuredDispatch')?.addEventListener('click', () => { startGame('games'); renderStandardHub('games', 'dispatch'); });
document.getElementById("homeBtn").addEventListener("click", goHome);
document.getElementById("openGamesBtn").addEventListener("click", openGameMenu);
document.getElementById("backMenuBtn").addEventListener("click", standardBack);
document.getElementById("chooseGameBtn").addEventListener("click", goMenu);
document.getElementById("playAgainBtn").addEventListener("click", () => startGame(state.mode,{setup:state.setup,fresh:true}));
els.listen.addEventListener("click", playCurrentAudio);
els.emojiToggle.addEventListener("click", () => {
  state.identifyEmojis = !state.identifyEmojis;
  document.getElementById("gameCard").classList.toggle("hide-answer-emojis", !state.identifyEmojis);
  els.emojiToggle.textContent = state.identifyEmojis ? "🙈" : "🖼️";
  els.emojiToggle.title = state.identifyEmojis ? "Hide answer pictures" : "Show answer pictures";
  els.emojiToggle.setAttribute("aria-label", els.emojiToggle.title);
});

els.sound.addEventListener("click", () => {
  state.muted = !state.muted;
  window.dispatchEvent(new Event('plants-sound'));
  els.sound.dataset.uiIcon = state.muted ? "muted" : "sound";
  els.sound.setAttribute('aria-pressed', String(!state.muted));
  els.sound.title = state.muted ? "Sound off (M)" : "Sound on (M)";
  els.sound.setAttribute("aria-label", state.muted ? "Turn sound on" : "Turn sound off");
  if (state.muted) {
    stopSpeech();
    for (const source of activeEffects) { try { source.stop(); } catch (_) {} }
    activeEffects.clear();
  }
});

document.getElementById("fullscreenBtn").addEventListener("click", async () => {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  } catch (_) {}
});

document.addEventListener("keydown", e => {
  if (work.held || e.defaultPrevented || e.isComposing || e.ctrlKey || e.altKey || e.metaKey ||
      e.target.closest?.("input, textarea, select, [contenteditable]:not([contenteditable='false'])")) return;
  const active = screens.game.classList.contains("active");
  if (active && !state.recovery && state.mode === "hangman" && /^[a-z]$/i.test(e.key)) {
    e.preventDefault();
    chooseHangmanLetter(e.key.toLowerCase());
    return;
  }
  if (e.key.toLowerCase() === "m") els.sound.click();
  if (e.key.toLowerCase() === "f") document.getElementById("fullscreenBtn").click();
  if (e.key === "Escape" && active && !document.fullscreenElement) standardBack();
  else if (e.key === 'Escape' && !document.fullscreenElement) {
    if (screens.home.classList.contains('active') && screens.home.classList.contains('menu-open')) goHome();
    else if (screens.results.classList.contains('active')) goMenu();
  }
  if (!active || state.recovery) return;
  if(e.target.closest?.('button')&&(e.key==='Enter'||e.code==='Space'))return;
  if (e.code === "Space") { e.preventDefault(); playCurrentAudio(); }
  if (["1", "2", "3"].includes(e.key)) {
    const target = els.answers.children[Number(e.key) - 1];
    if (target && !target.disabled) target.click();
  }
  if (e.key === "Enter") {
    const next = document.getElementById("nextBtn");
    if (next) next.click();
  }
});

// Attempts are browser-local, versioned and saved after meaningful input and on exit.
const saveAfterInput=()=>queueMicrotask(()=>rememberAttempt());
document.addEventListener('click',saveAfterInput);
document.addEventListener('keydown',saveAfterInput);
window.addEventListener('pagehide',()=>rememberAttempt(true));
window.addEventListener("pagehide", () => work.setHold("page", true));
window.addEventListener('pageshow',event=>{
  if(event.persisted&&!activeSession&&state.sessionKey&&screens.game.classList.contains('active')){
    const variant=JSON.parse(state.sessionKey)[4];
    const session=standardSession(state.mode,state.setup||TransportStandard.setupFor(state.mode,variant));
    const pending=state.questions.map(questionId).filter(id=>!(state.completedIds||[]).includes(id));
    if(session.key===state.sessionKey&&classroom.claim(session,pending))activeSession=session;
    else showScopeRecovery(state.mode,'The saved activity changed while this page was away. Choose how to continue.',true);
  }
  work.setHold('page',false);
});

// Plants parity: full-screen button swaps between the expand and collapse icons.
document.addEventListener("fullscreenchange", () => {
  const btn = document.getElementById("fullscreenBtn"), on = Boolean(document.fullscreenElement);
  btn.dataset.uiIcon = on ? "collapse" : "fullscreen";
  btn.setAttribute("aria-label", on ? "Exit full screen" : "Enter full screen");
  btn.title = on ? "Exit full screen (F)" : "Full screen (F)";
});
