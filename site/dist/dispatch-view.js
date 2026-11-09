// Transport Dispatch: choose a suitable vehicle, load, plan an open route crossing by crossing, deliver, unload.
// Every round builds a fresh town (small 3x3, medium 4x4, large 5x5 crossings) with a river, bridges, a ferry
// to an island, random places and roadworks. Difficulty changes the vehicle choices, roadworks, hints, fuel and stops.
// The town is drawn in code for now; painted planes and directional vehicle sprites can replace it later.
(() => {
  const SIZES = {small:['Small town', '9 crossings', 3], medium:['Medium town', '16 crossings', 4], large:['Big city', '25 crossings', 5]};
  const LEVELS = {
    easy:['Easy', 'Route hint · 2 vehicles to choose from'],
    medium:['Medium', 'Roadworks block the quickest way · 3 vehicles'],
    hard:['Hard', 'More roadworks, limited fuel, extra stops · 4 vehicles']
  };
  const JOBS = [3, 5, 7];
  const ROUNDS = [1, 3, 5];
  const CHOICES = {easy:2, medium:3, hard:4};
  const KEY = 'transport-dispatch-setup', BEST = 'transport-dispatch-best';
  const PLACES = {
    depot:['Depot', '🏢'], school:['School', '🏫'], station:['Station', '🚉'], hospital:['Hospital', '🏥'], dock:['Ferry dock', '⚓'],
    fire:['Fire station', '🚒'], building:['Building site', '🏗️'], farm:['Farm', '🌾'], shop:['Shop', '🏪'], houses:['Houses', '🏘️'],
    police:['Police station', '🚓'], park:['Park', '🌳'], island:['Island', '🏝️']
  };
  // Painted destination landmarks and the roadworks barrier replace the old emoji markers; the label and aria stay on the button.
  const art = name => { const i = document.createElement('img'); i.src = 'images/dispatch-map/' + name + '.webp'; i.alt = ''; i.decoding = 'async'; i.draggable = false; return i; };
  const landmark = place => { const s = el('span', 'dw-emoji dw-landmark'); s.append(art('landmark-' + place)); return s; };
  const TOWN_PLACES = {
    small:['depot', 'school', 'station', 'hospital', 'dock'],
    medium:['depot', 'school', 'station', 'hospital', 'dock', 'fire', 'building', 'farm', 'shop', 'houses'],
    large:['depot', 'school', 'station', 'hospital', 'dock', 'fire', 'building', 'farm', 'shop', 'houses', 'police', 'park']
  };
  const SMALL_EXTRAS = ['fire', 'building', 'farm', 'shop', 'houses', 'police', 'park'];
  const VEHICLES = {
    bus:{word:'vehicle.bus', label:'Bus', info:'12 seats · road', color:'#f4c453'},
    'school-bus':{word:'vehicle.school-bus', label:'School bus', info:'A whole class · road', color:'#f6b81f'},
    taxi:{word:'vehicle.taxi', label:'Taxi', info:'4 seats · road', color:'#ffe066'},
    van:{word:'vehicle.van', label:'Van', info:'Parcels · road', color:'#ef8f6e'},
    truck:{word:'vehicle.truck', label:'Truck', info:'Heavy loads · road', color:'#9cc97a'},
    tractor:{word:'vehicle.tractor', label:'Tractor', info:'Pulls a trailer · farm', color:'#c7a04e'},
    ambulance:{word:'vehicle.ambulance', label:'Ambulance', info:'Medical help · road', color:'#fdfdfd'},
    'fire-engine':{word:'vehicle.fire-engine', label:'Fire engine', info:'Hoses and ladders · road', color:'#e5533d'},
    'police-car':{word:'vehicle.police-car', label:'Police car', info:'Police help · road', color:'#8fb3e0'},
    ferry:{word:'vehicle.ferry', label:'Ferry', info:'Many seats · water', color:'#6cb4dc'},
    bicycle:{word:'vehicle.bicycle', label:'Bicycle', info:'1 rider · road', color:'#b9d98c'}
  };
  // Miniature World overhead sprites (artwork/dispatch/miniature-world-fleet-v1, approved 2026-11-09).
  // [phone length px, height/length, contact along the body: -1 rear end, 0 pivot, 1 front end]
  const SPRITES = {
    bus:[36, .2387, .7], 'school-bus':[36, .2412, .7], taxi:[28, .5411, .1], van:[29, .4492, -.7], truck:[34, .2988, -.15],
    tractor:[37, .3336, -.45], ambulance:[30, .4722, -1], 'fire-engine':[35, .2743, .35], 'police-car':[27, .5403, .05], ferry:[32, .3123, -.55]
  };
  const ON_WATER = 'The ferry travels on water. This trip is by road.';
  const FARM_ONLY = 'The tractor has one seat. It works on farms.';
  const TEMPLATES = [
    {id:'crowd', kind:'people', answer:'bus', from:['depot', 'station', 'houses', 'park'], to:['station', 'school', 'park', 'shop', 'houses'], count:[5, 8], via:2,
      title:j => `Take ${j.count} passengers from the ${name(j.from)} to the ${name(j.to)}`, load:'Load passengers', unload:'Unload passengers', done:'Everyone arrived safely.',
      right:'The bus has 12 seats, enough for everyone.',
      wrong:{taxi:'A taxi has 4 seats. There are too many passengers.', van:'The van carries parcels and has only 2 seats.', bicycle:'A bicycle carries just one rider.', ferry:ON_WATER, tractor:FARM_ONLY}},
    {id:'class', kind:'people', answer:'school-bus', from:['houses', 'park', 'station', 'depot'], to:['school'], count:[6, 9],
      title:j => `Take ${j.count} children from the ${name(j.from)} to school`, load:'Load the children', unload:'Help them off', done:'The whole class reached school.',
      right:'The school bus is made for taking a class to school.',
      wrong:{ambulance:'The ambulance is for people who are unwell or hurt.', tractor:FARM_ONLY, 'fire-engine':'The fire engine is for putting out fires.', taxi:'A taxi has 4 seats. A class needs many more.', ferry:ON_WATER}},
    {id:'taxi', kind:'people', answer:'taxi', from:['station', 'houses', 'shop'], to:['houses', 'station', 'hospital', 'park', 'shop'], count:[2, 2], via:1,
      title:j => `Take ${j.count} travellers with suitcases from the ${name(j.from)} to the ${name(j.to)}`, load:'Load passengers', unload:'Unload passengers', done:'The travellers arrived with their bags.',
      right:'A taxi has 4 seats, just right for a small group.',
      wrong:{tractor:FARM_ONLY, ferry:ON_WATER, truck:'The truck carries heavy loads, not passengers.', 'fire-engine':'The fire engine is for putting out fires.', 'police-car':'The police car is for police work.'}},
    {id:'parcels', kind:'parcel', answer:'van', from:['depot', 'station'], to:['shop', 'houses', 'school'], count:[4, 6], via:2,
      title:j => `Deliver ${j.count} parcels from the ${name(j.from)} to the ${name(j.to)}`, load:'Load the parcels', unload:'Unload the parcels', done:'All the parcels arrived.',
      right:'The van has room for all the parcels.',
      wrong:{bicycle:'A bicycle cannot carry this many parcels.', ambulance:'The ambulance is for people who need medical help.', bus:'Buses carry passengers, not parcels.', 'police-car':'The police car is for police work.', ferry:ON_WATER}},
    {id:'bricks', kind:'cargo', answer:'truck', from:['depot', 'station'], to:['building'], count:[4, 4],
      title:j => `Take a heavy load of bricks from the ${name(j.from)} to the building site`, load:'Load the bricks', unload:'Unload the bricks', done:'The builders have their bricks.',
      right:'The truck is built to carry heavy loads.',
      wrong:{van:'The van is too small for a heavy load of bricks.', bus:'Buses carry passengers, not bricks.', taxi:'A taxi carries passengers, not heavy bricks.', bicycle:'Bricks are far too heavy for a bicycle.', ferry:ON_WATER}},
    {id:'patient', kind:'patient', answer:'ambulance', from:['houses', 'school', 'park', 'shop', 'farm', 'station'], to:['hospital'], count:[1, 1],
      title:j => `Someone at the ${name(j.from)} feels very unwell. Take them to the hospital`, load:'Help them aboard', unload:'Help them inside', done:'The doctors can help now.',
      right:'The ambulance has medical help on board.',
      wrong:{tractor:'The tractor is for farm work. Someone unwell needs medical help.', ferry:ON_WATER, truck:'The truck carries loads. Someone unwell needs medical help.', taxi:'A taxi has no medical help on board.', 'fire-engine':'The fire engine puts out fires. Someone unwell needs an ambulance.'}},
    {id:'fire', kind:'crew', answer:'fire-engine', from:['fire'], to:['farm', 'shop', 'houses', 'school', 'park', 'building'], count:[3, 3],
      title:j => `There is a fire at the ${name(j.to)}! Send help from the fire station`, load:'Crew aboard', unload:'Put out the fire', done:'The fire is out.',
      right:'The fire engine carries water hoses and ladders.',
      wrong:{ambulance:'The ambulance helps unwell people. It has no water hose.', 'police-car':'The police car has no hose or ladder.', van:'The van carries parcels. It has no water hose.', bus:'The bus carries passengers. It has no water hose.'}},
    {id:'veg', kind:'veg', answer:'tractor', from:['farm'], to:['shop', 'depot'], count:[4, 4],
      title:j => `Pull a trailer of vegetables from the farm to the ${name(j.to)}`, load:'Load the trailer', unload:'Unload the vegetables', done:'Fresh vegetables arrived.',
      right:'The tractor pulls the farm trailer.',
      wrong:{taxi:'A taxi carries passengers, not a trailer of vegetables.', ambulance:'The ambulance is for people who need medical help.', bicycle:'A bicycle cannot pull a heavy farm trailer.', bus:'Buses carry passengers, not vegetables.'}},
    {id:'island', kind:'people', answer:'ferry', from:['dock'], to:['island'], count:[5, 8], sea:true, max:1,
      title:j => `Take ${j.count} passengers across the water to the island`, load:'Load passengers', unload:'Unload passengers', done:'Everyone reached the island.',
      right:'The ferry carries passengers across the water.',
      wrong:{bus:'Buses drive on roads. The island is across the water.', van:'Vans drive on roads. The island is across the water.', taxi:'Taxis drive on roads. The island is across the water.', truck:'Trucks drive on roads. The island is across the water.'}},
    {id:'police', kind:'crew', answer:'police-car', from:['police'], to:['station', 'shop', 'school', 'park'], count:[2, 2],
      title:j => `The traffic lights broke near the ${name(j.to)}. Send police to help`, load:'Officers aboard', unload:'Help the traffic', done:'The traffic is moving safely again.',
      right:'Police officers help keep traffic safe.',
      wrong:{tractor:FARM_ONLY, ambulance:'The ambulance is for people who are unwell.', 'school-bus':'The school bus takes children to school.', ferry:ON_WATER}}
  ];
  const ISLAND = [84, 91];

  const name = id => PLACES[id][0].toLowerCase();
  const el = (tag, className, text) => { const n = document.createElement(tag); if (className) n.className = className; if (text != null) n.textContent = text; return n; };
  const svgEl = (tag, attrs) => { const n = document.createElementNS('http://www.w3.org/2000/svg', tag); for (const k in attrs) n.setAttribute(k, attrs[k]); return n; };
  const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const shuffle = list => { const a = [...list]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = list => list[Math.floor(Math.random() * list.length)];
  const wordFor = id => (typeof transportWords !== 'undefined' ? transportWords : []).find(w => w.id === id);
  function smooth(p, r = 3) {
    let d = `M${p[0][0]} ${p[0][1]}`;
    for (let i = 1; i < p.length - 1; i++) {
      const [a, b, c] = [p[i - 1], p[i], p[i + 1]];
      const la = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, lc = Math.hypot(c[0] - b[0], c[1] - b[1]) || 1, k = Math.min(r, la / 2, lc / 2);
      const s = [b[0] - (b[0] - a[0]) / la * k, b[1] - (b[1] - a[1]) / la * k], t = [b[0] + (c[0] - b[0]) / lc * k, b[1] + (c[1] - b[1]) / lc * k];
      d += ` L${s[0].toFixed(2)} ${s[1].toFixed(2)} Q${b[0].toFixed(2)} ${b[1].toFixed(2)} ${t[0].toFixed(2)} ${t[1].toFixed(2)}`;
    }
    const last = p[p.length - 1]; return d + ` L${last[0].toFixed(2)} ${last[1].toFixed(2)}`;
  }
  const readJSON = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key) || 'null') || fallback; } catch { return fallback; } };
  const writeJSON = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };
  function readSetup() {
    const s = readJSON(KEY, {});
    return {size: SIZES[s.size] ? s.size : 'small', level: LEVELS[s.level] ? s.level : 'easy', jobs: JOBS.includes(s.jobs) ? s.jobs : 5, rounds: ROUNDS.includes(s.rounds) ? s.rounds : 3};
  }
  const setupKey = s => `${s.size}-${s.level}-${s.jobs}-${s.rounds}`;

  // ---------- Town generation ----------
  const edgeKey = (a, b) => a < b ? `${a}|${b}` : `${b}|${a}`;
  function makeTown(size) {
    const S = SIZES[size][2], rc = Math.floor((S - 1) / 2), j = S > 3 ? 1.6 : 1;
    const nodes = {}, edges = new Map();
    for (let c = 0; c < S; c++) for (let r = 0; r < S; r++) {
      const id = `${c}-${r}`;
      nodes[id] = {id, c, r, x: 12 + c * 76 / (S - 1) + (Math.random() * 2 - 1) * j, y: 10 + r * 62 / (S - 1) + (Math.random() * 2 - 1) * j, place: null};
    }
    const add = (a, b, bridge = false) => edges.set(edgeKey(a, b), {key: edgeKey(a, b), a, b, bridge});
    const bridgeRows = shuffle([...Array(S).keys()]).slice(0, S === 5 ? 3 : 2);
    for (let c = 0; c < S; c++) for (let r = 0; r < S; r++) {
      if (c < S - 1 && (c !== rc || bridgeRows.includes(r))) add(`${c}-${r}`, `${c + 1}-${r}`, c === rc);
      if (r < S - 1) add(`${c}-${r}`, `${c}-${r + 1}`);
    }
    const town = {size, S, rc, nodes, edges, riverX: (nodes[`${rc}-0`].x + nodes[`${rc + 1}-0`].x) / 2};
    // Knock out a few ordinary streets on bigger maps so the grid is less regular.
    let remove = {small: 0, medium: 2, large: 4}[size];
    for (const e of shuffle([...edges.values()].filter(e => !e.bridge))) {
      if (!remove) break;
      if (degree(town, e.a) <= 2 || degree(town, e.b) <= 2) continue;
      edges.delete(e.key);
      if (connected(town, new Set())) remove--; else edges.set(e.key, e);
    }
    // Places: the dock sits on the bottom row left of the river, the rest anywhere.
    const list = [...TOWN_PLACES[size]];
    if (size === 'small') list.push(...shuffle(SMALL_EXTRAS).slice(0, 2));
    const dockNode = nodes[`${rand(0, rc)}-${S - 1}`]; dockNode.place = 'dock';
    const free = shuffle(Object.values(nodes).filter(n => !n.place));
    for (const p of list) if (p !== 'dock' && free.length) free.pop().place = p;
    town.placeNode = {}; for (const n of Object.values(nodes)) if (n.place) town.placeNode[n.place] = n.id;
    return town;
  }
  const degree = (town, id) => [...town.edges.values()].filter(e => e.a === id || e.b === id).length;
  function neighbours(town, id, closed) {
    const out = [];
    for (const e of town.edges.values()) if (!closed.has(e.key)) { if (e.a === id) out.push(e.b); else if (e.b === id) out.push(e.a); }
    return out;
  }
  function shortest(town, from, to, closed, avoid) {
    const prev = {[from]: null}, queue = [from];
    if (avoid) prev[avoid] = undefined;
    while (queue.length) {
      const n = queue.shift(); if (n === to) break;
      for (const m of shuffle(neighbours(town, n, closed))) if (!(m in prev)) { prev[m] = n; queue.push(m); }
    }
    if (!(to in prev) || to === avoid) return null;
    const path = []; for (let n = to; n != null; n = prev[n]) path.unshift(n); return path;
  }
  function connected(town, closed) {
    const ids = Object.keys(town.nodes), seen = new Set([ids[0]]), queue = [ids[0]];
    while (queue.length) for (const m of neighbours(town, queue.shift(), closed)) if (!seen.has(m)) { seen.add(m); queue.push(m); }
    return seen.size === ids.length;
  }
  const pathEdges = path => path.slice(1).map((n, i) => edgeKey(path[i], n));
  function closeSome(town, closed, count, prefer) {
    const pool = prefer ? shuffle(prefer) : shuffle([...town.edges.keys()]);
    for (const key of pool) {
      if (!count) break;
      if (closed.has(key)) continue;
      const e = town.edges.get(key);
      if (e.bridge && [...town.edges.values()].filter(x => x.bridge && !closed.has(x.key)).length <= 1) continue;
      closed.add(key);
      if (connected(town, closed)) count--; else closed.delete(key);
    }
  }
  function makeJobs(town, count, level) {
    const present = new Set(Object.keys(town.placeNode)); present.add('island');
    const usable = TEMPLATES.map(t => ({t, from: t.from.filter(p => present.has(p)), to: t.to.filter(p => present.has(p))})).filter(x => x.from.length && x.to.length && (x.from.length > 1 || x.to.length > 1 || x.from[0] !== x.to[0]));
    const used = {}, jobs = [];
    while (jobs.length < count) {
      const options = usable.filter(x => (used[x.t.id] || 0) < (x.t.max || 2) && x.t.id !== jobs[jobs.length - 1]?.t.id);
      const {t, from, to} = pick(options.length ? options : usable);
      const start = pick(from), dest = pick(to.filter(p => p !== start));
      if (!dest) continue;
      used[t.id] = (used[t.id] || 0) + 1;
      const job = {t, from: start, to: dest, count: rand(...t.count), via: null, extra: 0};
      if (level === 'hard' && t.via && !t.sea) {
        // Prefer a stop close to the way, so the extra stop is a short detour rather than a tour of the town.
        const a = town.placeNode[start], b = town.placeNode[dest], none = new Set();
        const stops = [...present].filter(p => !['island', 'dock', start, dest].includes(p)).map(p => {
          const v = town.placeNode[p], one = shortest(town, a, v, none, b), two = shortest(town, v, b, none);
          return {p, len: one && two ? one.length + two.length : Infinity};
        }).filter(s => s.len < Infinity).sort((x, y) => x.len - y.len).slice(0, 2);
        if (stops.length) { job.via = pick(stops).p; job.extra = t.via; }
      }
      const wrong = shuffle(Object.keys(t.wrong)).slice(0, CHOICES[level] - 1);
      job.choices = shuffle([t.answer, ...wrong]);
      jobs.push(job);
    }
    return jobs;
  }

  let view = null;

  class DispatchView {
    constructor(root) {
      this.root = root; this.held = false; this.alive = true; this.timeline = null; this.revision = 0;
      this.media = matchMedia('(prefers-reduced-motion: reduce)');
      this.setup = readSetup();
      if (window.gsap && window.MotionPathPlugin) gsap.registerPlugin(MotionPathPlugin);
      this.renderSetup();
    }

    renderSetup() {
      this.stopMotion(); this.resize?.disconnect();
      els.round.textContent = 'Transport Dispatch';
      const box = el('section', 'dispatch-setup');
      box.append(el('h3', '', 'Transport Dispatch'), el('p', '', 'Choose the right vehicle, plan a road that is open and deliver everyone safely. Every round is a new town.'));
      const group = (title, items, key) => {
        const wrap = el('div', 'dispatch-options'); wrap.setAttribute('role', 'group'); wrap.setAttribute('aria-label', title);
        wrap.append(el('h4', '', title));
        for (const [value, label, hint] of items) {
          const b = el('button', 'dispatch-option'); b.type = 'button'; b.setAttribute('aria-pressed', String(value === this.setup[key]));
          b.append(el('strong', '', label)); if (hint) b.append(el('span', '', hint));
          b.onclick = () => { this.setup[key] = value; for (const o of wrap.querySelectorAll('button')) o.setAttribute('aria-pressed', String(o === b)); showBest(); };
          wrap.append(b);
        }
        return wrap;
      };
      const best = el('p', 'dispatch-best');
      const showBest = () => { const b = readJSON(BEST, {})[setupKey(this.setup)]; best.textContent = b ? `Best for this setup: ${b.stars} of ${b.max} stars` : 'No best score for this setup yet.'; };
      box.append(
        group('Map size', Object.entries(SIZES).map(([k, [l, h]]) => [k, l, h]), 'size'),
        group('Difficulty', Object.entries(LEVELS).map(([k, [l, h]]) => [k, l, h]), 'level'),
        group('Jobs in each round', JOBS.map(n => [n, `${n} jobs`, n === 3 ? 'Quick' : n === 5 ? 'Standard' : 'Long']), 'jobs'),
        group('Rounds', ROUNDS.map(n => [n, n === 1 ? '1 round' : `${n} rounds`, n === 1 ? 'One town' : `${n} different towns`]), 'rounds'),
        best);
      showBest();
      const start = el('button', 'dispatch-primary', 'Start dispatching'); start.type = 'button';
      start.onclick = () => { if (this.held) return; writeJSON(KEY, this.setup); this.startGame(); };
      box.append(start);
      this.root.replaceChildren(box);
    }

    startGame() { this.round = 0; this.totalStars = 0; this.roundScores = []; this.startRound(); }

    startRound() {
      const {size, level, jobs} = this.setup;
      this.town = makeTown(size);
      this.roadworks = new Set();
      closeSome(this.town, this.roadworks, {easy: {small: 0, medium: 0, large: 0}, medium: {small: 0, medium: 1, large: 2}, hard: {small: 1, medium: 2, large: 4}}[level][size]);
      this.jobs = makeJobs(this.town, jobs, level);
      this.index = 0; this.stars = 0;
      this.buildBoard(); this.startJob();
    }

    buildBoard() {
      const r = this.root, t = this.town; r.replaceChildren();
      const shell = el('section', `dispatch is-size-${t.size}`); this.shell = shell;
      const head = el('div', 'dispatch-head'); this.titleEl = el('h3', 'dispatch-title'); this.subEl = el('p', 'dispatch-sub'); this.countEl = el('span', 'dispatch-count');
      const words = el('div'); words.append(this.titleEl, this.subEl); head.append(words, this.countEl);
      const world = el('div', 'dispatch-world'); world.setAttribute('role', 'group'); this.world = world;
      const svg = svgEl('svg', {viewBox: '0 0 100 100', preserveAspectRatio: 'none', 'aria-hidden': 'true'}); this.svg = svg;
      const rx = t.riverX;
      // Painted map fills (artwork/dispatch/miniature-world-map-v1): one board-space sample each, kept square by fitTextures().
      const defs = svgEl('defs');
      this.texturePatterns = ['land', 'water'].map(kind => {
        const p = svgEl('pattern', {id: `dw-${kind}-fill`, patternUnits: 'userSpaceOnUse', width: 34, height: 34});
        p.append(svgEl('image', {href: 'images/dispatch-map/' + kind + '-texture.webp', width: 34, height: 34, preserveAspectRatio: 'none'})); defs.append(p); return p;
      });
      svg.append(defs);
      svg.append(
        svgEl('path', {class: 'dw-water', d: `M${rx - 3.4} 0 H${rx + 3.4} C${rx + 4.5} 30 ${rx + 2} 55 ${rx + 3.4} 82 H${rx - 3.4} C${rx - 2} 55 ${rx - 4.5} 30 ${rx - 3.4} 0 Z`}),
        svgEl('path', {class: 'dw-water', d: 'M0 82 C20 80 40 83 60 81 S90 80 100 82 V100 H0 Z'}),
        svgEl('ellipse', {class: 'dw-island', cx: ISLAND[0], cy: ISLAND[1], rx: 10, ry: 6}));
      const dock = t.nodes[t.placeNode.dock];
      // The ferry stays on the water: it waits at the end of the pier and stops at the island's shore.
      this.ferryPath = [[dock.x, 84], [dock.x + 8, 91], [ISLAND[0] - 15, ISLAND[1] + 1], [ISLAND[0] - 9, ISLAND[1]]];
      svg.append(svgEl('path', {class: 'dw-road dw-pier', d: smooth([[dock.x, dock.y], [dock.x, 84]])}), svgEl('path', {class: 'dw-lane', d: smooth(this.ferryPath, 6)}));
      const xy = id => [t.nodes[id].x, t.nodes[id].y];
      for (const e of t.edges.values()) if (e.bridge) svg.append(svgEl('path', {class: 'dw-deck', d: smooth([xy(e.a), xy(e.b)])}));
      for (const e of t.edges.values()) svg.append(svgEl('path', {class: 'dw-road', d: smooth([xy(e.a), xy(e.b)])}));
      for (const e of t.edges.values()) svg.append(svgEl('path', {class: 'dw-centre', d: smooth([xy(e.a), xy(e.b)])}));
      this.hintEl = svgEl('path', {class: 'dw-hint', d: ''}); this.planEl = svgEl('path', {class: 'dw-plan', d: ''});
      svg.append(this.hintEl, this.planEl);
      world.append(svg);
      this.worksEls = {};
      for (const e of t.edges.values()) {
        const [a, b] = [t.nodes[e.a], t.nodes[e.b]], w = el('span', 'dw-works'); w.append(art('roadworks-marker'));
        w.style.left = (a.x + b.x) / 2 + '%'; w.style.top = (a.y + b.y) / 2 + '%'; w.hidden = true; w.setAttribute('aria-hidden', 'true');
        this.worksEls[e.key] = w; world.append(w);
      }
      this.nodeEls = {};
      for (const n of Object.values(t.nodes)) {
        const b = el('button', n.place ? 'dw-node dw-node--place' : 'dw-node'); b.type = 'button';
        b.style.left = n.x + '%'; b.style.top = n.y + '%';
        b.setAttribute('aria-label', n.place ? PLACES[n.place][0] : `Crossing ${n.r + 1}-${n.c + 1}`);
        if (n.place) { b.append(landmark(n.place)); b.append(el('span', 'dw-label', PLACES[n.place][0])); }
        b.onclick = () => this.tapNode(n.id);
        this.nodeEls[n.id] = b; world.append(b);
      }
      const isle = el('span', 'dw-node dw-node--place dw-node--island'); isle.style.left = ISLAND[0] + '%'; isle.style.top = ISLAND[1] + '%';
      isle.append(landmark('island'), el('span', 'dw-label', PLACES.island[0])); world.append(isle); this.islandEl = isle;
      this.fireEl = el('span', 'dw-fire', '🔥'); this.fireEl.hidden = true; this.fireEl.setAttribute('aria-hidden', 'true'); world.append(this.fireEl);
      this.actor = el('div', 'dw-actor'); this.actor.setAttribute('aria-hidden', 'true'); this.actorImg = el('img'); this.actorImg.alt = ''; this.actorImg.decoding = 'async'; this.actor.append(this.actorImg); world.append(this.actor);
      this.loads = Array.from({length: 12}, () => { const m = el('i', 'dw-load'); m.setAttribute('aria-hidden', 'true'); world.append(m); return {el: m, x: 0, y: 0, a: 0, active: false}; });
      this.choicesEl = el('div', 'dispatch-vehicles'); this.choicesEl.setAttribute('role', 'group'); this.choicesEl.setAttribute('aria-label', 'Vehicles');
      this.toolsEl = el('div', 'dispatch-tools');
      this.fuelEl = el('span', 'dispatch-fuel');
      this.undoBtn = el('button', 'dispatch-secondary', 'Undo'); this.undoBtn.type = 'button'; this.undoBtn.onclick = () => this.undo();
      this.clearBtn = el('button', 'dispatch-secondary', 'Clear route'); this.clearBtn.type = 'button'; this.clearBtn.onclick = () => this.clearRoute();
      this.toolsEl.append(this.fuelEl, this.undoBtn, this.clearBtn);
      this.statusEl = el('p', 'dispatch-status'); this.statusEl.setAttribute('role', 'status'); this.statusEl.setAttribute('aria-live', 'polite');
      const actions = el('div', 'dispatch-actions');
      this.primary = el('button', 'dispatch-primary'); this.primary.type = 'button'; this.primary.onclick = () => this.advance();
      this.restartBtn = el('button', 'dispatch-secondary', 'Restart job'); this.restartBtn.type = 'button'; this.restartBtn.onclick = () => { if (!this.held) this.startJob(true); };
      actions.append(this.primary, this.restartBtn);
      shell.append(head, world, this.choicesEl, this.toolsEl, this.statusEl, actions); r.append(shell);
      this.size = {w: 1, h: 1};
      this.resize = new ResizeObserver(([entry]) => { this.size = {w: entry.contentRect.width, h: entry.contentRect.height}; this.fitTextures(); this.paint(); });
      this.resize.observe(world);
      // Measure now too: the observer can be late in a background tab, and sprite sizes depend on it.
      this.size = {w: world.clientWidth || 1, h: world.clientHeight || 1}; this.fitTextures();
    }

    // The board SVG stretches 100x100 to the world's shape, so squash each texture tile back to square pixels.
    fitTextures() {
      const hw = 34 * this.size.w / Math.max(1, this.size.h);
      for (const p of this.texturePatterns || []) { p.setAttribute('height', hw); p.firstChild.setAttribute('height', hw); }
    }

    point(place) { if (place === 'island') return ISLAND; const n = this.town.nodes[this.town.placeNode[place]]; return [n.x, n.y]; }

    startJob(restart = false) {
      this.stopMotion();
      const job = this.job = this.jobs[this.index], t = this.town, level = this.setup.level;
      if (!restart) {
        // Medium and hard put roadworks on the quickest way so the obvious route is blocked.
        this.closed = new Set(this.roadworks);
        if (level !== 'easy' && !job.t.sea) {
          const route = this.fullShortest(this.closed);
          if (route) closeSome(t, this.closed, 1, pathEdges(route));
        }
        this.mistakes = 0;
      }
      this.startNode = t.placeNode[job.from]; this.destNode = job.to === 'island' ? null : t.placeNode[job.to]; this.viaNode = job.via ? t.placeNode[job.via] : null;
      this.best = job.t.sea ? null : this.fullShortest(this.closed);
      this.budget = level === 'hard' && this.best ? this.best.length - 1 + 2 : Infinity;
      this.phase = 'choose'; this.vehicle = null;
      if (!restart) { this.firstTry = true; this.blocked = false; }
      this.plan = [this.startNode]; this.onboard = 0; this.viaDone = false;
      const [sx, sy] = this.point(job.from);
      this.pos = job.t.sea ? {x: this.ferryPath[0][0], y: this.ferryPath[0][1], rotation: Math.atan2(7, 8) * 180 / Math.PI} : {x: sx, y: sy, rotation: 0};
      if (!job.t.sea) this.pos = this.parkAt(this.startNode);
      const total = job.count + job.extra;
      this.loads.forEach((p, i) => {
        const atVia = i >= job.count && i < total, active = i < total;
        const [bx, by] = atVia ? this.point(job.via) : [sx, sy], k = atVia ? i - job.count : i;
        Object.assign(p, {x: bx - 4 + (k % 5) * 2.2, y: by < 25 ? by + 10 + Math.floor(k / 5) * 2.6 : by - 7 - Math.floor(k / 5) * 2.6, a: active ? 1 : 0, active});
        p.el.className = `dw-load dw-load--${job.t.kind}`;
      });
      this.titleEl.textContent = job.t.title(job) + (job.via ? `. Collect ${job.extra} more at the ${name(job.via)} on the way.` : '.');
      this.world.setAttribute('aria-label', `Town map. From the ${name(job.from)} to the ${name(job.to)}. Tap crossings to plan the route.`);
      this.choicesEl.replaceChildren();
      for (const id of job.choices) {
        const v = VEHICLES[id], word = wordFor(v.word), b = el('button', 'dispatch-vehicle'); b.type = 'button'; b.dataset.vehicle = id;
        if (word?.image) { const img = el('img'); img.src = word.image; img.alt = ''; b.append(img); }
        b.append(el('strong', '', v.label), el('small', '', v.info));
        b.onclick = () => this.pickVehicle(id); this.choicesEl.append(b);
      }
      this.choicesEl.style.gridTemplateColumns = `repeat(${job.choices.length === 4 ? 2 : job.choices.length},minmax(0,1fr))`;
      this.say(job.t.sea ? 'Choose a vehicle for a trip across the water.' : 'Choose the right vehicle for this job.');
      this.update();
    }

    fullShortest(closed) {
      const t = this.town, job = this.job;
      if (job.t.sea) return null;
      const a = t.placeNode[job.from], b = t.placeNode[job.to];
      if (!job.via) return shortest(t, a, b, closed);
      const v = t.placeNode[job.via], one = shortest(t, a, v, closed), two = shortest(t, v, b, closed);
      return one && two ? [...one, ...two.slice(1)] : null;
    }

    say(text) { this.statusEl.textContent = text; }
    busy() { return ['boarding', 'travelling', 'unloading', 'pickup'].includes(this.phase); }

    pickVehicle(id) {
      if (this.held || this.phase !== 'choose') return;
      const job = this.job;
      if (id !== job.t.answer) { this.mistakes++; this.firstTry = false; this.vehicle = null; this.say(job.t.wrong[id]); this.update(id); return; }
      this.vehicle = id; this.say(`${job.t.right} ${job.t.load} when ready.`); this.update();
    }

    tapNode(id) {
      if (this.held || !['route', 'ready'].includes(this.phase)) return;
      const t = this.town, plan = this.plan, last = plan[plan.length - 1];
      if (plan.length > 1 && id === plan[plan.length - 2] && last !== this.viaNode) { this.undo(); return; }
      if (this.phase === 'ready') { this.say('The route already reaches the destination. Undo to change it, or dispatch.'); return; }
      if (id === last) return;
      const key = edgeKey(last, id);
      if (!t.edges.has(key)) { this.say('Tap a crossing joined by a road to the end of your route. The glowing dots show where you can go.'); return; }
      if (this.closed.has(key)) { this.mistakes++; this.blocked = true; this.say('Roadworks! That road is closed. Find another way round.'); this.flash(key); return; }
      if (plan.length - 1 >= this.budget) { this.say(`Not enough fuel to go further. You have fuel for ${this.budget} roads. Undo and find a shorter way.`); return; }
      plan.push(id); this.afterPlanChange();
    }

    afterPlanChange() {
      const last = this.plan[this.plan.length - 1], job = this.job;
      if (last === this.destNode && (!this.viaNode || this.plan.includes(this.viaNode))) {
        this.phase = 'ready';
        const extra = this.plan.length - this.best.length;
        this.say(extra <= 0 ? 'Route planned. That is the shortest way. Dispatch when ready.' : `Route planned, ${extra} ${extra === 1 ? 'road' : 'roads'} longer than the shortest way. Dispatch, or undo to try a shorter way.`);
      } else {
        this.phase = 'route';
        this.say(last === this.destNode ? `This is the ${name(job.to)}, but first collect at the ${name(job.via)}. Keep going.` : this.plan.length === 1 ? `Tap the glowing crossings to drive from the ${name(job.from)} to the ${name(job.to)}.` : this.viaNode && last === this.viaNode ? `The route reaches the ${name(job.via)}. Now head to the ${name(job.to)}.` : 'Keep going. Tap the next crossing.');
      }
      this.update();
    }
    undo() { if (this.held || !['route', 'ready'].includes(this.phase) || this.plan.length < 2) return; this.plan.pop(); this.afterPlanChange(); }
    clearRoute() { if (this.held || !['route', 'ready'].includes(this.phase)) return; this.plan = [this.startNode]; this.afterPlanChange(); }
    flash(key) { const w = this.worksEls[key]; if (!w) return; w.classList.remove('is-flash'); void w.offsetWidth; w.classList.add('is-flash'); }

    advance() {
      if (this.held || this.primary.disabled) return;
      const job = this.job;
      if (this.phase === 'choose') {
        this.phase = 'boarding'; this.say('Loading while the vehicle is stopped.');
        this.board(this.loads.slice(0, job.count), () => {
          if (job.t.sea) { this.phase = 'ready'; this.say('All aboard. The ferry lane is open. Dispatch when ready.'); }
          else this.afterPlanChange();
        });
      } else if (this.phase === 'ready') {
        if (job.t.sea) { this.travel(this.ferryPath, 'island'); }
        else {
          const cut = this.viaNode ? this.plan.indexOf(this.viaNode) : -1;
          this.legs = cut > 0 ? [this.plan.slice(0, cut + 1), this.plan.slice(cut)] : [this.plan];
          this.travel(this.legs[0].map(id => [this.town.nodes[id].x, this.town.nodes[id].y]), cut > 0 ? job.via : job.to);
        }
      } else if (this.phase === 'checkpoint') {
        this.phase = 'pickup'; this.say(`${job.extra} more climb aboard at the ${name(job.via)}.`);
        this.board(this.loads.slice(job.count, job.count + job.extra), () => { this.viaDone = true; this.phase = 'continue'; this.say(`Everyone aboard. Continue to the ${name(job.to)}.`); });
      } else if (this.phase === 'continue') {
        this.travel(this.legs[1].map(id => [this.town.nodes[id].x, this.town.nodes[id].y]), job.to);
      } else if (this.phase === 'arrived') {
        this.unload();
      } else if (this.phase === 'done') {
        this.index++;
        if (this.index >= this.jobs.length) this.finishRound(); else this.startJob();
      }
      this.update();
    }

    run(build, finish) {
      const token = this.revision;
      if (this.media.matches || !window.gsap || !window.MotionPathPlugin) { finish(); this.update(); return; }
      this.timeline = gsap.timeline({paused: true, onComplete: () => { if (!this.alive || token !== this.revision) return; this.timeline = null; finish(); this.update(); }});
      build(this.timeline); if (!this.held) this.timeline.play();
    }

    board(items, finish) {
      const c = this.contact();
      this.run(tl => items.forEach((p, i) => tl.to(p, {x: c.x, y: c.y, a: 0, duration: .4, ease: 'power1.inOut', onUpdate: () => this.paint()}, i * .14)),
        () => { items.forEach(p => { p.a = 0; }); this.onboard += items.length; finish(); });
    }

    travel(points, stop) {
      this.phase = 'travelling'; this.say(`On the way to the ${name(stop)}.`);
      // Road trips start from the parked spot and end parked beside the place, not on top of its sign.
      const road = !this.job.t.sea, endNode = road ? this.plan.find(id => this.town.nodes[id].x === points[points.length - 1][0] && this.town.nodes[id].y === points[points.length - 1][1]) : null;
      const parked = road && endNode ? this.parkAt(endNode, points[points.length - 2]) : null;
      if (road) points = [[this.pos.x, this.pos.y], ...points.slice(0, -1), [parked.x, parked.y]];
      const end = points[points.length - 1], prev = points[points.length - 2];
      const seconds = Math.min(9, Math.max(2.2, (points.length - 1) * .9));
      this.run(tl => tl.to(this.pos, {duration: seconds, ease: 'power1.inOut', motionPath: {path: smooth(points), autoRotate: true}, onUpdate: () => this.paint()}),
        () => {
          this.pos = parked || {x: end[0], y: end[1], rotation: Math.atan2(end[1] - prev[1], end[0] - prev[0]) * 180 / Math.PI};
          if (this.job.via && stop === this.job.via && !this.viaDone) { this.phase = 'checkpoint'; this.say(`Stopped at the ${name(stop)}. Collect the ${this.job.extra} waiting there.`); }
          else { this.phase = 'arrived'; this.say(`Stopped safely at the ${name(stop)}. ${this.job.t.unload} when ready.`); }
        });
    }

    unload() {
      const job = this.job, items = this.loads.filter(p => p.active), [qx, qy] = this.point(job.to);
      this.phase = 'unloading'; this.say(job.t.id === 'fire' ? 'The crew sprays water on the fire.' : 'Unloading at the stop.');
      const c = this.contact(); items.forEach(p => { p.x = c.x; p.y = c.y; p.a = 0; });
      const spot = i => ({x: qx - 4 + (i % 5) * 2.2, y: qy < 25 ? qy + 10 + Math.floor(i / 5) * 2.6 : qy - 7 - Math.floor(i / 5) * 2.6});
      this.run(tl => items.forEach((p, i) => tl.to(p, {...spot(i), a: 1, duration: .4, ease: 'power1.inOut', onUpdate: () => this.paint()}, i * .11)),
        () => {
          items.forEach((p, i) => Object.assign(p, spot(i), {a: 1}));
          this.onboard = 0; this.phase = 'done';
          const shortestRoute = job.t.sea || this.plan.length <= this.best.length;
          const got = [this.firstTry, !this.blocked, shortestRoute].filter(Boolean).length;
          this.jobStars = got; this.stars += got;
          const notes = [this.firstTry ? 'right vehicle first time' : 'vehicle changed', this.blocked ? 'tried a closed road' : 'no closed roads', shortestRoute ? 'shortest route' : 'a longer route'];
          this.say(`${job.t.done} ${'⭐'.repeat(got)}${got < 3 ? '' : ' Perfect!'} (${notes.join(', ')})`);
          if (typeof tone === 'function') { tone(523, 0, .12); tone(659, .12, .12); tone(784, .24, .18); }
        });
    }

    finishRound() {
      this.stopMotion(); this.resize?.disconnect();
      const max = this.jobs.length * 3, last = this.round + 1 >= this.setup.rounds;
      this.roundScores.push(this.stars); this.totalStars += this.stars;
      const box = el('section', 'dispatch-setup dispatch-done');
      if (!last) {
        els.round.textContent = `Round ${this.round + 1} complete`;
        box.append(el('h3', '', `Round ${this.round + 1} of ${this.setup.rounds} complete`), el('p', 'dispatch-done-score', `${this.stars} of ${max} ⭐`),
          el('p', '', this.stars === max ? 'A perfect town! The next town is waiting.' : 'Every job was delivered. The next town has new roads and new jobs.'));
        const next = el('button', 'dispatch-primary', 'Next town'); next.type = 'button';
        next.onclick = () => { if (this.held) return; this.round++; this.startRound(); };
        const row = el('div', 'dispatch-actions'); row.append(next); box.append(row);
      } else {
        els.round.textContent = 'Dispatch complete';
        const all = this.setup.rounds * max, key = setupKey(this.setup), bests = readJSON(BEST, {}), prev = bests[key];
        const record = !prev || this.totalStars > prev.stars;
        if (record) { bests[key] = {stars: this.totalStars, max: all}; writeJSON(BEST, bests); }
        box.append(el('h3', '', 'Dispatch complete'), el('p', 'dispatch-done-score', `${this.totalStars} of ${all} ⭐`));
        if (this.setup.rounds > 1) box.append(el('p', '', this.roundScores.map((s, i) => `Town ${i + 1}: ${s}`).join(' · ')));
        box.append(el('p', '', record ? (prev ? `New best! Your old best was ${prev.stars}.` : 'Your first score for this setup.') : `Best for this setup: ${prev.stars} of ${prev.max}.`));
        if (this.setup.level !== 'hard' && this.totalStars >= all * .85) box.append(el('p', 'dispatch-tip', `Great dispatching. Try ${this.setup.level === 'easy' ? 'Medium' : 'Hard'} for roadworks${this.setup.level === 'easy' ? '' : ', fuel and extra stops'}.`));
        else if (this.setup.size !== 'large' && this.totalStars >= all * .85) box.append(el('p', 'dispatch-tip', `Ready for more? Try a ${this.setup.size === 'small' ? 'medium town' : 'big city'}.`));
        const again = el('button', 'dispatch-primary', 'Play again'); again.type = 'button'; again.onclick = () => { if (!this.held) this.startGame(); };
        const change = el('button', 'dispatch-secondary', 'Change settings'); change.type = 'button'; change.onclick = () => { if (!this.held) this.renderSetup(); };
        const row = el('div', 'dispatch-actions'); row.append(again, change); box.append(row);
        if (typeof burstConfetti === 'function') burstConfetti();
      }
      this.root.replaceChildren(box);
    }

    update(wrongId) {
      if (!this.shell?.isConnected) return;
      const job = this.job, t = this.town, routing = ['route', 'ready'].includes(this.phase) && !job.t.sea;
      const roundText = this.setup.rounds > 1 ? `Town ${this.round + 1} of ${this.setup.rounds} · ` : '';
      this.countEl.textContent = `${roundText}Job ${this.index + 1} of ${this.jobs.length} · ⭐ ${this.stars}`;
      els.round.textContent = `${roundText}Job ${this.index + 1} of ${this.jobs.length}`;
      const total = job.count + job.extra;
      this.subEl.textContent = this.phase === 'done' ? `${total} delivered` : this.onboard ? `${this.onboard} aboard` : `Waiting at the ${name(job.from)}${job.via ? ` · ${job.extra} more at the ${name(job.via)}` : ''}`;
      for (const b of this.choicesEl.children) { b.disabled = this.phase !== 'choose' || this.held; b.setAttribute('aria-pressed', String(b.dataset.vehicle === this.vehicle)); b.classList.toggle('is-wrong', b.dataset.vehicle === wrongId); }
      this.choicesEl.hidden = this.phase !== 'choose' && this.phase !== 'boarding';
      // Map state
      for (const [key, w] of Object.entries(this.worksEls)) w.hidden = !this.closed.has(key);
      const last = this.plan[this.plan.length - 1];
      const next = routing && this.phase === 'route' ? new Set(neighbours(t, last, new Set())) : new Set();
      for (const [id, b] of Object.entries(this.nodeEls)) {
        b.classList.toggle('is-start', id === this.startNode);
        b.classList.toggle('is-dest', id === this.destNode);
        b.classList.toggle('is-via', id === this.viaNode && !this.viaDone);
        b.classList.toggle('is-route', routing && this.plan.includes(id));
        b.classList.toggle('is-next', next.has(id) && (id !== this.plan[this.plan.length - 2] || last === this.viaNode));
        b.disabled = this.held || !routing;
      }
      this.islandEl.classList.toggle('is-dest', job.to === 'island');
      const xy = id => [t.nodes[id].x, t.nodes[id].y];
      this.planEl.setAttribute('d', routing && this.plan.length > 1 ? smooth(this.plan.map(xy)) : '');
      this.hintEl.setAttribute('d', this.setup.level === 'easy' && routing && this.best ? smooth(this.best.map(xy)) : '');
      const fire = job.t.id === 'fire' && this.phase !== 'done';
      this.fireEl.hidden = !fire;
      if (fire) { const [fx, fy] = this.point(job.to); this.fireEl.style.left = fx + 3 + '%'; this.fireEl.style.top = fy - 6 + '%'; }
      // Route tools
      this.toolsEl.hidden = !routing;
      const used = this.plan.length - 1;
      this.fuelEl.textContent = this.budget === Infinity ? `Route: ${used} ${used === 1 ? 'road' : 'roads'}` : `Fuel: ${this.budget - used} of ${this.budget} roads left`;
      this.fuelEl.classList.toggle('is-low', this.budget !== Infinity && this.budget - used <= 1);
      this.undoBtn.disabled = this.held || this.plan.length < 2; this.clearBtn.disabled = this.held || this.plan.length < 2;
      const id = this.vehicle || job.t.answer, src = `images/dispatch/${id}.webp`;
      if (this.actorId !== id) { this.actorId = id; this.actorImg.src = src; }
      this.actor.hidden = !this.vehicle && this.phase === 'choose';
      const labels = {choose: job.t.load, boarding: 'Loading…', route: 'Plan the route', ready: 'Dispatch', travelling: 'Travelling…', checkpoint: `Collect ${job.extra} more`, pickup: 'Collecting…', continue: `Continue to the ${name(job.to)}`, arrived: job.t.unload, unloading: 'Unloading…', done: this.index + 1 >= this.jobs.length ? (this.round + 1 >= this.setup.rounds ? 'See results' : 'Finish this town') : 'Next job'};
      this.primary.textContent = labels[this.phase];
      this.primary.disabled = this.held || this.busy() || this.phase === 'route' || (this.phase === 'choose' && !this.vehicle);
      this.restartBtn.disabled = this.held || this.phase === 'done' || this.busy();
      this.paint();
    }

    // One scale per board: phone lengths grow with the map, but the longest vehicle (the tractor
    // and trailer, 37) always fits inside the shortest street of this map, with room to turn.
    scale() {
      const {w, h} = this.size, S = this.town.S, street = Math.min(w * .76, h * .62) / (S - 1);
      return Math.max(.6, Math.min(Math.min(w, h) / 340, street * .68 / 37, 2.2));
    }
    // Stopped pose: on the road next to a place, clear of its sign. Arriving, it stops short on the
    // road it came in on, facing the place; at the start it waits on a neighbouring open road, facing out.
    parkAt(id, from) {
      const t = this.town, n = t.nodes[id], {w, h} = this.size;
      let dir;
      if (from) dir = [from[0] - n.x, from[1] - n.y];
      else {
        const near = [[n.c + 1, n.r], [n.c - 1, n.r], [n.c, n.r + 1], [n.c, n.r - 1]].map(([c, r]) => `${c}-${r}`).filter(o => t.edges.has(edgeKey(id, o)));
        const o = near.find(k => !this.closed.has(edgeKey(id, k))) || near[0];
        dir = o ? [t.nodes[o].x - n.x, t.nodes[o].y - n.y] : [1, 0];
      }
      const px = [dir[0] * w / 100, dir[1] * h / 100], len = Math.hypot(...px) || 1, sp = SPRITES[this.vehicle || this.job.t.answer] || [30];
      const sign = this.nodeEls?.[id]?.querySelector('.dw-emoji'), d = Math.min(len * .7, (sign ? sign.offsetWidth / 2 : 14) + sp[0] * this.scale() / 2 + 3);
      const x = n.x + px[0] / len * d / w * 100, y = n.y + px[1] / len * d / h * 100;
      const heading = from ? [n.x - from[0], n.y - from[1]] : dir;
      return {x, y, rotation: Math.atan2(heading[1], heading[0]) * 180 / Math.PI};
    }
    screenAngle() { const {w, h} = this.size, r = this.pos.rotation * Math.PI / 180; return Math.atan2(Math.sin(r) * h, Math.cos(r) * w); }
    // Where passengers and loads meet the stopped vehicle (its door, ramp or cargo bed), in map %.
    contact() {
      const sp = SPRITES[this.vehicle || this.job.t.answer]; if (!sp) return {x: this.pos.x, y: this.pos.y};
      const {w, h} = this.size, a = this.screenAngle(), d = sp[2] * sp[0] * this.scale() / 2;
      return {x: this.pos.x + Math.cos(a) * d / w * 100, y: this.pos.y + Math.sin(a) * d / h * 100};
    }

    paint() {
      if (!this.actor) return;
      const {w, h} = this.size, sp = SPRITES[this.actorId];
      // Plan-view sprites turn with the road in screen space; no flipping, so the kerb side stays true.
      if (sp) this.actor.style.width = sp[0] * this.scale() + 'px';
      this.actor.style.transform = `translate(${w * this.pos.x / 100}px,${h * this.pos.y / 100}px) translate(-50%,-50%) rotate(${this.screenAngle() * 180 / Math.PI}deg)`;
      for (const p of this.loads) { p.el.hidden = !p.active; p.el.style.opacity = p.a; p.el.style.transform = `translate(${w * p.x / 100}px,${h * p.y / 100}px)`; }
    }

    stopMotion() { this.revision++; this.timeline?.kill(); this.timeline = null; }
    setHeld(held) {
      this.held = held;
      if (held) this.timeline?.pause(); else if (this.media.matches) this.timeline?.progress(1); else this.timeline?.resume();
      if (this.shell?.isConnected && this.job) this.update();
    }
    destroy() { this.alive = false; this.stopMotion(); this.resize?.disconnect(); }
  }

  globalThis.TransportDispatch = {
    mount(root) { this.destroy(); view = new DispatchView(root); if (globalThis.__dispatchHeld) view.setHeld(true); },
    setHeld(held) { globalThis.__dispatchHeld = held; view?.setHeld(held); },
    destroy() { view?.destroy(); view = null; },
    _view: () => view
  };
})();
