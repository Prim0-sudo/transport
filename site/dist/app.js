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

const emojiSlug = name => name.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "");
vehicles.forEach(vehicle => {
  const slug = emojiSlug(vehicle.name);
  const userSlug = vehicle.name === "space shuttle" ? "rocket_ship" : slug;
  vehicle.iconImages = [
    `images/emoji-codex/${slug}.png`,
    `images/emoji-user/${userSlug}.png`
  ];
});

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
const classroom = new TransportClassroom({entries:vehicles,questions:safetyQuestions,curriculum:TransportCurriculum});
let activeSession = null;

const zones = [
  { name: "Land", icon: "🛣️", iconImage: "images/categories/land.png", value: "land" },
  { name: "Water", icon: "🌊", iconImage: "images/categories/water.png", value: "water" },
  { name: "Air", icon: "☁️", iconImage: "images/categories/air.png", value: "air" }
];

const modeInfo = {
  learn: { badge: "VOCABULARY", title: "What vehicle is this?", helper: "" },
  sort: { badge: "SORTING", title: "Where does the {vehicle} travel?", helper: "" },
  sound: { badge: "LISTENING", title: "Which vehicle makes this sound?", helper: "" },
  identify: { badge: "WHICH ONE IS IT?", title: "", helper: "" },
  safety: { badge: "ROAD SAFETY", title: "", helper: "" },
  hangman: { badge: "ICE CREAM MELTDOWN", title: "", helper: "" },
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
const activeEffects = new Set();
const landingScene = new TransportLanding(document.querySelector('.backdrop'));
const work = new TransportLifecycle({ onHold: held => {
  landingScene.setHold('activity', held);
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
  work.cancel();
  wheelTickTimers = [];
  promptTask = confettiTask = null;
  speechHeld = false;
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  if (activeClip) activeClip.pause();
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

function speak(text) {
  work.cancelTask(promptTask);
  if (state.muted || work.held || !text || !("speechSynthesis" in window)) return;
  speechHeld = false;
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

function identifyChoices(vehicle) {
  const choices = [vehicle];
  for (const candidate of shuffled(classroom.pool('identify'))) {
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

function startGame(mode, {fresh=false}={}) {
  if (mode === "sound") return;
  rememberAttempt(true);
  cancelCurrentWork();
  activeSession=null;
  if(mode==='flip'){
    state={...state,mode,round:0,score:0,questions:[],answered:false,wrongThisRound:false,flip:null,wheel:null,completedIds:[],sessionKey:null};
    showScreen('game');renderQuestion();return;
  }
  const session=classroom.prepare(mode);
  if(!session.pool.length){showScopeRecovery(mode);return;}
  if(session.invalidated&&!fresh){showScopeRecovery(mode,'The saved activity no longer matches the available content. Choose how to continue.',true);return;}
  if(!fresh&&restoreAttempt(session))return;
  if(fresh)classroom.discard(session.key);
  activeSession=session;
  const reserved=classroom.reserve(session,mode==='safety'?7:10);
  let questions=reserved;
  if(mode==='identify')questions=reserved.map(vehicle=>({vehicle,choices:identifyChoices(vehicle)}));
  if(mode==='hangman')questions=reserved.map(vehicle=>({vehicle,guessed:[],misses:0,sadConeIndex:null}));
  if(mode==='safety')questions=reserved.map(q=>({...q,answerOrder:shuffled(q.answerIds)}));
  if(!questions.length){showScopeRecovery(mode,'No unplayed words are available in this activity cycle.',true);return;}
  state = { ...state, mode, round: 0, score: 0, questions, answered: false, wrongThisRound: false, flip: null, practice:session.pool.length<2&&['identify','wheel'].includes(mode),completedIds:[],sessionKey:session.key,wheel: mode === "wheel" ? { remaining: [...questions], selected: null, landing: null, spinning: false, returning: false } : null };
  showScreen("game");
  renderQuestion();
  rememberAttempt();
}

function questionId(item) { return item?.vehicle?.id||item?.id; }

function completeQuestion(id=questionId(state.questions[state.round])) {
  if(!activeSession||!id)return;
  classroom.complete(activeSession.key,id);
  state.completedIds=[...new Set([...(state.completedIds||[]),id])];
}

function rememberAttempt(release=false) {
  if(!activeSession||!screens.game.classList.contains('active')||state.recovery)return;
  const snapshot=JSON.parse(JSON.stringify(state,(_key,value)=>value?.id?.startsWith('vehicle.')&&value.eligibility?{$vehicle:value.id}:value));
  if(snapshot.wheel){
    snapshot.wheel.selected=snapshot.wheel.selected||snapshot.wheel.landing||snapshot.wheel.pending||null;
    snapshot.wheel.spinning=false;snapshot.wheel.landing=null;snapshot.wheel.pending=null;snapshot.wheel.returning=false;
  }
  if(snapshot.mode==='hangman')for(const round of snapshot.questions){round.sadConeIndex=null;round.winCelebration=false;}
  const ui={disabledChoiceIds:[...els.answers.querySelectorAll('.answer-btn.wrong')].map(button=>button.dataset.choiceId).filter(Boolean)};
  classroom.save(activeSession,{state:snapshot,ui});
  if(release){classroom.release(activeSession.key);activeSession=null;}
}

function restoreAttempt(session) {
  const saved=classroom.restore(session);if(!saved)return false;
  try{
    const map=new Map(vehicles.map(item=>[item.id,item]));
    const restored=JSON.parse(JSON.stringify(saved.state),(_key,value)=>{
      if(value&&Object.hasOwn(value,'$vehicle')){if(!map.has(value.$vehicle))throw Error('Unknown word');return map.get(value.$vehicle);}return value;
    });
    const mode=JSON.parse(session.key)[0],ids=restored.questions?.map(questionId);
    if(restored.mode!==mode||!ids?.length||new Set(ids).size!==ids.length||ids.some(id=>!session.pool.some(item=>item.id===id))||!Number.isInteger(restored.round)||restored.round<0||restored.round>=ids.length||!Number.isInteger(restored.score)||restored.score<0||restored.score>ids.length)throw Error('Invalid attempt');
    if(!Array.isArray(restored.completedIds)||restored.completedIds.some(id=>!ids.includes(id)))throw Error('Invalid progress');
    if(mode==='identify'&&restored.questions.some(item=>!Array.isArray(item.choices)||!item.choices.length||new Set(item.choices.map(c=>c.id)).size!==item.choices.length||!item.choices.some(c=>c.id===item.vehicle.id)||item.choices.some(c=>!session.pool.some(p=>p.id===c.id))))throw Error('Invalid choices');
    if(mode==='hangman'&&restored.questions.some(item=>!Array.isArray(item.guessed)||item.guessed.some(l=>!(/^[a-z]$/).test(l))||new Set(item.guessed).size!==item.guessed.length||!Number.isInteger(item.misses)||item.misses<0||item.misses>8))throw Error('Invalid spelling progress');
    if(mode==='safety'){
      restored.questions=restored.questions.map(item=>{const canonical=safetyQuestions.find(q=>q.id===item.id);if(!canonical||!Array.isArray(item.answerOrder)||new Set(item.answerOrder).size!==canonical.answerIds.length||item.answerOrder.some(id=>!canonical.answerIds.includes(id)))throw Error('Invalid safety choices');return {...canonical,answerOrder:item.answerOrder};});
    }
    if(mode==='flip'&&(!restored.flip||!Array.isArray(restored.flip.tiles)||restored.flip.tiles.length!==ids.length*2||restored.flip.tiles.some(t=>!ids.includes(t.vehicle?.id))))throw Error('Invalid matching board');
    if(mode==='wheel'&&(!restored.wheel||!Array.isArray(restored.wheel.remaining)||restored.wheel.remaining.some(v=>!ids.includes(v.id))))throw Error('Invalid wheel');
    const pending=ids.filter(id=>!restored.completedIds.includes(id));
    if(!classroom.claim(session,pending))throw Error('Reservation changed');
    const muted=state.muted;state={...restored,muted,recovery:false};activeSession=session;
    const answered=Boolean(state.answered),wrong=Boolean(state.wrongThisRound);
    showScreen('game');renderQuestion();work.cancelTask(promptTask);
    state.answered=answered;state.wrongThisRound=wrong;
    if(mode==='hangman')renderHangman();
    if(['sort','identify','safety'].includes(mode)&&!state.practice){
      for(const button of els.answers.querySelectorAll('.answer-btn')){
        const previouslyWrong=(saved.ui?.disabledChoiceIds||[]).includes(button.dataset.choiceId);
        button.disabled=answered||previouslyWrong;
        button.classList.toggle('wrong',previouslyWrong&&button.dataset.correct!=='true');
        button.classList.toggle('correct',answered&&button.dataset.correct==='true');
      }
    }
    if(answered&&mode!=='wheel'){
      els.feedback.replaceChildren();
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
  els.modeBadge.textContent=modeInfo[mode].badge;els.question.textContent='Choose content for this activity';els.helper.textContent='';
  els.round.textContent='Selection';els.progress.style.width='0%';els.scorePill.hidden=true;els.feedback.replaceChildren();
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
  state.recovery=false;els.stage.style.display='';els.listen.disabled=false;els.scorePill.hidden=false;
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
  els.round.textContent = `${state.round + 1}/${total}`;
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
  els.listen.textContent = "🔊";
  els.emojiToggle.hidden = state.mode !== "identify";
  els.emojiToggle.textContent = state.identifyEmojis ? "🙈" : "🖼️";
  els.emojiToggle.title = state.identifyEmojis ? "Hide answer pictures" : "Show answer pictures";
  els.emojiToggle.setAttribute("aria-label", els.emojiToggle.title);

  if (state.mode === "flip") {
    if(state.flip)renderFlipGame();else renderFlipSetup();
    return;
  }
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

  promptTask = work.schedule(() => state.mode === "sound" ? playCurrentAudio() : speakCurrentPrompt(), 260);
}

function renderFlipSetup() {
  const pool=classroom.pool('flip');
  if(pool.length<2){showScopeRecovery('flip','Matching needs at least two different words. Change the selection or practise these words in Meet the Vehicles.');return;}
  clearVehiclePicture();
  els.emoji.textContent = "🃏";
  els.name.textContent = "MATCHING GAME";
  els.stage.dataset.sound = "";
  els.question.textContent = "How many vocabulary words would you like?";
  els.round.textContent = "CHOOSE";
  els.progress.style.width = "0%";
  els.answers.innerHTML = `<div class="flip-setup"><p>Each word has two matching tiles.</p><div class="flip-choice-row"><button class="flip-choice" data-count="10">10 words<span>20 tiles</span></button><button class="flip-choice" data-count="20">20 words<span>40 tiles</span></button><button class="flip-choice" data-count="30">30 words<span>60 tiles</span></button></div></div>`;
  els.answers.querySelectorAll("[data-count]").forEach(button => {
    const limit=Number(button.dataset.count),session=classroom.prepare('flip',classroom.scope,`pairs:${limit}`);
    const available=session.cycle.remaining.length||session.pool.length;
    const count=Math.min(limit,available);
    button.replaceChildren(document.createTextNode(`Up to ${limit} words`));
    const detail=document.createElement('span');detail.textContent=`${count} ${count===1?'word · practice':'words'} · ${count*2} tiles`;button.append(detail);
    button.addEventListener('click',()=>startFlipGame(limit));
  });
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
  state.flip = { tiles, firstTileId: null, locked: false, matches: 0 };
  state.score = 0;
  renderFlipGame();
  rememberAttempt();
}

function renderFlipGame() {
  const { tiles, matches } = state.flip;
  clearVehiclePicture();
  els.emoji.textContent = "";
  els.name.textContent = "";
  els.stage.dataset.sound = "";
  els.question.textContent = "";
  els.round.textContent = `MATCHES ${matches}/${state.questions.length}`;
  els.progress.style.width = `${(matches / state.questions.length) * 100}%`;
  els.score.textContent = matches;
  if (!els.answers.querySelector(".flip-board")) {
  els.answers.innerHTML = `<div class="flip-board flip-board-${tiles.length}" aria-label="Vocabulary matching tiles">${tiles.map(tile => `<button class="flip-tile ${tile.flipped || tile.matched ? "flipped" : ""} ${tile.matched ? "matched" : ""}" data-tile-id="${tile.id}" ${tile.matched ? "disabled" : ""} aria-label="${tile.flipped || tile.matched ? tile.vehicle.name : "Hidden tile"}"><span class="flip-tile-inner"><span class="flip-tile-back">?</span><span class="flip-tile-front"><img src="${vehicleEmojiPath(tile.vehicle)}" alt=""><strong>${tile.vehicle.name}</strong></span></span></button>`).join("")}</div>`;
  els.answers.querySelectorAll("[data-tile-id]").forEach(tile => tile.addEventListener("click", () => flipTile(tile.dataset.tileId)));
  }
  for (const tile of tiles) {
    const button = els.answers.querySelector(`[data-tile-id="${tile.id}"]`);
    button.classList.toggle("flipped", tile.flipped || tile.matched);
    button.classList.toggle("matched", tile.matched);
    button.disabled = tile.matched;
    button.setAttribute("aria-label", tile.flipped || tile.matched ? tile.vehicle.name : "Hidden tile");
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
    els.feedback.className = "feedback good";
    els.feedback.innerHTML = '<button class="next-btn" id="nextBtn">Finish game</button>';
    document.getElementById("nextBtn").onclick = finishGame;
    speak("You found every match!");
  }
}

function wheelColors(count) {
  const colors = ["#ffd54a", "#ff9d7b", "#a4e57b", "#75c9ff", "#c7a8ff", "#ffb6dc"];
  const slice = 360 / count;
  return `conic-gradient(from -90deg, ${Array.from({ length: count }, (_, index) => `${colors[index % colors.length]} ${index * slice}deg ${(index + 1) * slice}deg`).join(", ")})`;
}

function renderWheel() {
  const game = state.wheel;
  const total = state.questions.length;
  const wordsRead = total - game.remaining.length;
  clearVehiclePicture();
  els.emoji.textContent = "";
  els.name.textContent = "";
  els.stage.dataset.sound = "";
  els.question.textContent = "";
  els.round.textContent = `WORDS ${wordsRead}/${total}`;
  els.progress.style.width = `${(wordsRead / total) * 100}%`;
  els.score.textContent = wordsRead;
  if (game.selected) {
    els.answers.innerHTML = `<div class="wheel-reveal"><strong>${game.selected.name}</strong><p>Read the word together.</p><button class="next-btn" id="wheelNextBtn">Next ➜</button></div>`;
    document.getElementById("wheelNextBtn").onclick = nextWheelWord;
    return;
  }
  const count = game.remaining.length;
  const slice = 360 / count;
  const segmentEmojis = game.remaining.map((vehicle, index) => {
    const angle = -90 + (index + .5) * slice;
    const radians = angle * Math.PI / 180;
    const x = 50 + 34 * Math.cos(radians);
    const y = 50 + 34 * Math.sin(radians);
    const rotation = game.spinning ? -(game.rotation || 0) : 0;
    return `<span class="wheel-segment-emoji" style="--x:${x}%; --y:${y}%; --segment-angle:${angle}deg; --counter-angle:${-angle}deg; --emoji-rotation:${rotation}deg" aria-hidden="true">${vehicle.icon || "🛥️"}</span>`;
  }).join("");
  const spinClass = game.spinning ? "spinning" : game.returning ? "returning" : "";
  const landingWord = game.landing ? `<div class="wheel-landing-word">${game.landing.name}</div>` : "";
  els.answers.innerHTML = `<div class="wheel-stage"><div class="wheel-wrap"><div class="vocab-wheel ${spinClass}" style="--wheel-background:${wheelColors(count)}; --wheel-rotation:${game.rotation || 0}deg">${segmentEmojis}<button class="wheel-hub" id="wheelSpinBtn" ${game.spinning || game.landing ? "disabled" : ""} aria-label="${game.spinning ? "Wheel is spinning" : "Spin the wheel"}">${game.spinning ? "…" : "SPIN"}</button></div><div class="wheel-pointer" aria-hidden="true">◀</div>${landingWord}</div></div>`;
  document.getElementById("wheelSpinBtn").onclick = spinWheel;
}

function spinWheel() {
  const game = state.wheel;
  if (game.spinning || !game.remaining.length) return;
  const selectedIndex = Math.floor(Math.random() * game.remaining.length);
  const slice = 360 / game.remaining.length;
  game.pending = game.remaining[selectedIndex];
  game.rotation = 2610 - (selectedIndex * slice + slice / 2);
  game.spinning = true;
  game.returning = false;
  renderWheel();
  scheduleWheelTicks(4200);
  work.schedule(() => {
    game.spinning = false;
    game.landing = game.pending;
    game.pending = null;
    renderWheel();
    work.schedule(() => {
      game.selected = game.landing;
      game.landing = null;
      renderWheel();
    }, 1400);
  }, 4200);
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
  els.name.textContent = showName ? vehicle.name.toUpperCase() : "?";
  els.stage.dataset.sound = vehicle.sound;
}

function clearVehiclePicture() {
  els.emoji.removeAttribute('role');els.emoji.removeAttribute('aria-label');
  els.emoji.classList.remove("vehicle-picture", "vehicle-icon-image");
  els.emoji.style.backgroundImage = "";
  els.emoji.style.backgroundPosition = "";
}

function setVehiclePicture(vehicle) {
  els.emoji.textContent = "";
  els.emoji.classList.add("vehicle-picture");
  els.emoji.style.backgroundImage = `url("${vehicleEmojiPath(vehicle)}")`;
  els.emoji.style.backgroundPosition = "center";
  els.emoji.setAttribute('role','img');els.emoji.setAttribute('aria-label','Transport picture to identify');
  els.name.textContent = "";
  els.stage.dataset.sound = "";
}

function renderLearn() {
  const v = state.questions[state.round];
  els.question.textContent = "What vehicle is this?";
  setVehicle(v, true);
  els.definition.textContent = v.definition;
  els.definition.classList.add("visible");
  els.answers.innerHTML = `
    <button class="answer-btn" data-action="word"><span class="answer-icon">🗣️</span><span>Say: ${v.name}</span></button>
    <button class="answer-btn" data-action="clue"><span class="answer-icon">💡</span><span>Hear the meaning</span></button>
    <button class="answer-btn" data-action="next"><span class="answer-icon">➡️</span><span>Next vehicle</span></button>`;
  els.answers.querySelector('[data-action="word"]').onclick = () => speak(v.name);
  els.answers.querySelector('[data-action="clue"]').onclick = () => speak(v.definition);
  els.answers.querySelector('[data-action="next"]').onclick = () => { if(!state.practice)state.score++; nextQuestion(); };
}

function renderSort() {
  const v = state.questions[state.round];
  els.question.textContent = `Where does the ${v.name} travel?`;
  setVehicle(v, true);
  const place = v.zone === "air" ? "in the air" : `on ${v.zone}`;
  zones.forEach(z => makeAnswer(z.name, z.icon, z.value === v.zone, `A ${v.name} travels ${place}.`, false, z.iconImage));
}

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

function renderIdentify() {
  const item = state.questions[state.round];
  const v = item.vehicle;
  els.question.textContent = identifyQuestion(item.choices);
  setVehiclePicture(v);
  if(item.choices.length===1){
    state.practice=true;
    setVehicle(v,true);
    const note=document.createElement('p');note.className='practice-note';note.textContent='One distinct picture is available. Practise this word, or use Teacher to change the selection.';els.answers.append(note);
    const next=document.createElement('button');next.className='answer-btn';next.textContent='Next word';next.onclick=nextQuestion;els.answers.append(next);return;
  }
  item.choices.forEach(choice => {
    makeAnswer(choice.name, choice.icon, choice.name === v.name, `Yes! It is a ${v.name}.`, true);
  });
}

function renderSafety() {
  const item = state.questions[state.round];
  els.question.textContent = item.q;
  clearVehiclePicture();
  els.emoji.textContent = item.icon;
  els.name.textContent = "BE SAFE!";
  els.stage.dataset.sound = "";
  item.answerOrder.forEach(id=>{const i=item.answerIds.indexOf(id),answer=item.answers[i];makeAnswer(answer[0],answer[1],i===item.correct,item.explain,false,'',id);});
}

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

function renderHangman() {
  const item = state.questions[state.round];
  const v = item.vehicle;
  const guessed = new Set(item.guessed);
  const letters = hangmanLetters(v.name);
  const scoopCount = MAX_SPELLING_MISSES;
  clearVehiclePicture();
  els.emoji.textContent = "";
  els.name.textContent = "";
  els.stage.dataset.sound = "";
  els.question.textContent = "";
  const wordMarkup = [...v.name].map(character => {
    if (character === " ") return '<span class="hangman-letter hangman-space" aria-hidden="true"></span>';
    const shown = !/[a-z]/i.test(character) || guessed.has(character.toLowerCase()) || state.answered;
    return `<span class="hangman-letter">${shown ? character : ""}</span>`;
  }).join("");
  const scoopFlavors = ["strawberry", "vanilla", "mint"];
  const scoopsRemaining = scoopCount - item.misses;
  const cones = Array.from({ length: Math.ceil(scoopCount / SCOOPS_PER_CONE) }, (_, coneIndex) => {
    const coneCapacity = Math.min(SCOOPS_PER_CONE, scoopCount - coneIndex * SCOOPS_PER_CONE);
    const scoopsOnCone = Math.min(coneCapacity, Math.max(0, scoopsRemaining - coneIndex * SCOOPS_PER_CONE));
    const scoops = Array.from({ length: scoopsOnCone }, (_, scoopIndex) => {
      const index = coneIndex * SCOOPS_PER_CONE + scoopIndex;
      return `<i class="ice-cream-scoop ice-cream-scoop-${scoopFlavors[index % scoopFlavors.length]}" style="--scoop-index:${index}" aria-hidden="true"></i>`;
    }).join("");
    const coneMarkup = scoopsOnCone > 0
      ? '<span class="ice-cream-cone" aria-hidden="true"></span>'
      : item.sadConeIndex === coneIndex ? '<span class="ice-cream-sad-face" role="img" aria-label="Sad face">😢</span>' : "";
    return `<div class="ice-cream-scene">${coneMarkup}<span class="ice-cream-stack" aria-hidden="true">${scoops}</span></div>`;
  }).join("");
  const iceCreamMarkup = item.winCelebration
    ? '<div class="ice-cream-meltdown ice-cream-meltdown-cleared" aria-label="Ice cream celebration"></div>'
    : `<div class="ice-cream-meltdown" aria-label="Ice cream scoops remaining: ${scoopsRemaining} of ${scoopCount}"><div class="ice-cream-scenes">${cones}</div></div>`;
  const keyboard = "abcdefghijklmnopqrstuvwxyz".split("").map(letter => {
    const wasGuessed = guessed.has(letter);
    const isCorrect = letters.includes(letter);
    const className = wasGuessed ? (isCorrect ? "correct" : "wrong") : "";
    return `<button class="hangman-key ${className}" data-letter="${letter}" ${wasGuessed || state.answered ? "disabled" : ""}>${letter.toUpperCase()}</button>`;
  }).join("");
  els.answers.innerHTML = `<div class="hangman-board">${iceCreamMarkup}<div class="hangman-word" aria-label="Hidden transport word">${wordMarkup}</div><div class="hangman-keys" aria-label="Letter keyboard">${keyboard}</div></div>`;
  els.answers.querySelectorAll("[data-letter]").forEach(button => button.addEventListener("click", () => chooseHangmanLetter(button.dataset.letter)));
}

function chooseHangmanLetter(letter) {
  if (state.mode !== "hangman" || state.answered || state.recovery) return;
  const item = state.questions[state.round];
  if (item.guessed.includes(letter)) return;
  item.guessed.push(letter);
  const letters = hangmanLetters(item.vehicle.name);
  const correct = letters.includes(letter);
  const scoopsBefore = MAX_SPELLING_MISSES - item.misses;
  if (!correct) item.misses++;
  const lostCone = !correct && scoopsBefore > 0 && (scoopsBefore - 1) % SCOOPS_PER_CONE === 0;
  const lostConeIndex = lostCone ? Math.floor((scoopsBefore - 1) / SCOOPS_PER_CONE) : null;
  if (lostCone) showSadConeForThreeSeconds(item, lostConeIndex);
  const complete = [...letters].every(character => item.guessed.includes(character));
  if (complete || item.misses >= MAX_SPELLING_MISSES) {
    state.answered = true;
    completeQuestion(item.vehicle.id);
    if (complete && item.misses === 0) state.score++;
    renderHangman();
    els.score.textContent = state.score;
    els.feedback.className = complete ? "feedback good" : "feedback try";
    els.feedback.innerHTML = `<button class="next-btn" id="nextBtn" aria-label="Next word">➜</button>`;
    speak(complete ? `Correct. ${item.vehicle.name}.` : item.vehicle.name);
    if (complete) { tone(523, 0, .16); tone(659, .16, .16); tone(784, .32, .28); }
    if (complete) { burstConfetti(); showHangmanWinSequence(item); }
    else showHangmanSadRain(item);
    document.getElementById("nextBtn").onclick = nextQuestion;
    return;
  }
  els.feedback.className = "feedback";
  els.feedback.textContent = "";
  if (correct) tone(523, 0, .16); else tone(180, 0, .18, "sine", .08);
  renderHangman();
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
    els.feedback.className = "feedback";
    els.feedback.textContent = "";
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
  els.feedback.innerHTML = `<button class="next-btn" id="nextBtn" aria-label="Next">➜</button>`;
  els.score.textContent = state.score;
  speak("Correct!");
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
  if (state.mode === "safety") return state.questions[state.round].q;
  if (state.mode === "identify") {
    const item = state.questions[state.round];
    return identifyQuestion(item.choices);
  }
  if (state.mode === "hangman") return "";
  if (state.mode === "flip") return "";
  if (state.mode === "wheel") return "";
  const v = state.questions[state.round];
  if (state.mode === "learn") return `This is a ${v.name}.`;
  if (state.mode === "sort") return `Where does the ${v.name} travel? Land, water, or air?`;
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
  const ratio = state.score / total;
  els.stars.textContent = ratio >= .85 ? "⭐⭐⭐" : ratio >= .55 ? "⭐⭐" : "⭐";
  if(state.practice)els.stars.textContent='Practice complete';
  document.querySelector('.result-score').hidden=Boolean(state.practice);
  els.resultMessage.textContent = state.mode === "safety" ? "You made safe travel choices!" : state.mode === "sort" ? "You know where vehicles travel!" : state.mode === "identify" ? "You identified all the transportation pictures!" : state.mode === "hangman" ? "You built transport words before the ice cream melted!" : state.mode === "flip" ? "You found every vocabulary match!" : state.mode === "wheel" ? "You practised every vocabulary word!" : `You reviewed all ${vehicles.length} transportation words!`;
  showScreen("results");
  speak(`Round complete! You got ${state.score} out of ${total}.`);
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
  focusLandingHeading('menuTitle');
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
  landingScene.setReduced(reducedControl.checked);
  landingTeacher.close();refreshTeacherButton();
});
refreshTeacherButton();

// Retain the existing playable activities; use their existing illustrations in the shared menu.
const menuArt = {learn:'bus',sort:'boat',sound:'helicopter',identify:'car',safety:'police_car',hangman:'truck',flip:'train',wheel:'bicycle'};
for (const card of document.querySelectorAll('.mode-card')) {
  const image = document.createElement('img');
  image.src = `images/emoji-codex/${menuArt[card.dataset.mode]}.png`;
  image.alt = '';
  card.querySelector('.mode-icon').replaceChildren(image);
}
landingScene.setActive(true);

document.querySelectorAll(".mode-card").forEach(btn => btn.addEventListener("click", () => startGame(btn.dataset.mode)));
document.getElementById("homeBtn").addEventListener("click", goHome);
document.getElementById("openGamesBtn").addEventListener("click", openGameMenu);
document.getElementById("backMenuBtn").addEventListener("click", goMenu);
document.getElementById("chooseGameBtn").addEventListener("click", goMenu);
document.getElementById("playAgainBtn").addEventListener("click", () => startGame(state.mode));
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
  els.sound.textContent = state.muted ? "Sound off" : "Sound on";
  els.sound.setAttribute('aria-pressed', String(!state.muted));
  els.sound.title = state.muted ? "Sound off (M)" : "Sound on (M)";
  els.sound.setAttribute("aria-label", state.muted ? "Turn sound on" : "Turn sound off");
  if (state.muted) {
    speechHeld = false;
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    if (activeClip) activeClip.pause();
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
  if (e.key === "Escape" && active && !document.fullscreenElement) goMenu();
  else if (e.key === 'Escape' && !document.fullscreenElement) {
    if (screens.home.classList.contains('active') && screens.home.classList.contains('menu-open')) goHome();
    else if (screens.results.classList.contains('active')) goMenu();
  }
  if (!active || state.recovery) return;
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
    const session=classroom.prepare(state.mode,classroom.scope,variant);
    const pending=state.questions.map(questionId).filter(id=>!(state.completedIds||[]).includes(id));
    if(session.key===state.sessionKey&&classroom.claim(session,pending))activeSession=session;
    else showScopeRecovery(state.mode,'The saved activity changed while this page was away. Choose how to continue.',true);
  }
  work.setHold('page',false);
});
