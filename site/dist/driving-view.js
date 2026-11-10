// Transport Driving: one top-down town, three modes.
//  Safe Drive  - drive to the named place; stop at red lights, wait at zebra crossings, give cyclists space, pull over for sirens.
//  Taxi        - pick up a passenger and take them where they ask; the same road rules apply.
//  Park and Go - follow action words (drive forward, turn left, turn right, reverse, stop, park) one at a time.
// Arrow keys move in map directions (Park and Go: forward, left, right, reverse). Tap a crossing to drive there.
// The car, people, cyclist and lights are drawn placeholders; painted sprites can replace them later.
(() => {
  const KEY = 'transport-driving-setup', BEST = 'transport-driving-best';
  const MODES = {
    safe:['Safe Drive', 'Drive to each place. Follow the road rules.'],
    taxi:['Taxi', 'Pick up passengers and take them where they ask.'],
    park:['Park and Go', 'Follow the action words, then park.']
  };
  const LEVELS = {
    easy:['Easy', 'Small town · traffic lights only'],
    medium:['Medium', 'Bigger town · lights and zebra crossings'],
    hard:['Hard', 'Cyclists and sirens too']
  };
  const TRIPS = [3, 5, 7];
  const GRID = {easy:[4, 3], medium:[5, 4], hard:[6, 4]};
  const PLACE_COUNT = {easy:4, medium:6, hard:8};
  const PLACES = {school:'School', station:'Station', hospital:'Hospital', shop:'Shop', park:'Park', farm:'Farm', police:'Police station',
    fire:'Fire station', houses:'Houses', depot:'Depot', building:'Building site'};
  const RIDERS = [['person.passenger', 'A passenger'], ['person.firefighter', 'A firefighter'], ['person.mechanic', 'A mechanic'], ['person.pilot', 'A pilot'],
    ['person.delivery-worker', 'A delivery worker'], ['person.train-conductor', 'A train conductor'], ['person.boat-captain', 'A boat captain'], ['person.driver', 'A bus driver']];
  const DIRS = {up:[0, -1], right:[1, 0], down:[0, 1], left:[-1, 0]};
  const ORDER = ['up', 'right', 'down', 'left'];
  const ANGLE = {right:0, down:90, left:180, up:270};
  const ACTIONS = {forward:'Drive forward', left:'Turn left', right:'Turn right', reverse:'Reverse', stop:'Stop', park:'Park'};
  const STEP = .42;

  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const svgEl = (tag, attrs = {}) => { const e = document.createElementNS('http://www.w3.org/2000/svg', tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); return e; };
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const readJSON = (k, f) => { try { return JSON.parse(localStorage.getItem(k) || 'null') || f; } catch { return f; } };
  const writeJSON = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  const edgeKey = (a, b) => a < b ? `${a}|${b}` : `${b}|${a}`;
  const id = (c, r) => `${c}-${r}`;
  function readSetup() {
    const s = readJSON(KEY, {});
    return {mode: MODES[s.mode] ? s.mode : 'safe', level: LEVELS[s.level] ? s.level : 'easy', trips: TRIPS.includes(s.trips) ? s.trips : 5};
  }
  const carSVG = colour => `<svg viewBox="0 0 60 32" aria-hidden="true"><rect x="2" y="3" width="56" height="26" rx="9" fill="${colour}" stroke="#183a51" stroke-width="2.5"/><rect x="17" y="7" width="23" height="18" rx="4" fill="#fffbed" stroke="#183a51" stroke-width="2"/><rect x="40" y="8" width="7" height="16" rx="2" fill="#2d5d8a"/><rect x="10" y="8" width="5" height="16" rx="2" fill="#2d5d8a"/><circle cx="56" cy="9" r="2.3" fill="#ffe7a0"/><circle cx="56" cy="23" r="2.3" fill="#ffe7a0"/><rect x="2" y="7" width="2" height="5" fill="#d64545"/><rect x="2" y="20" width="2" height="5" fill="#d64545"/></svg>`;
  const personSVG = coat => `<svg viewBox="0 0 20 20" aria-hidden="true"><ellipse cx="10" cy="11" rx="8" ry="5.5" fill="${coat}" stroke="#183a51" stroke-width="1.6"/><circle cx="10" cy="10" r="4" fill="#7a4a2a" stroke="#183a51" stroke-width="1.4"/></svg>`;
  const cyclistSVG = '<svg viewBox="0 0 40 20" aria-hidden="true"><rect x="2" y="9" width="36" height="2.4" rx="1.2" fill="#183a51"/><rect x="31" y="4" width="2.4" height="12" rx="1" fill="#183a51"/><ellipse cx="18" cy="10" rx="7" ry="6" fill="#f4e04d" stroke="#183a51" stroke-width="1.6"/><circle cx="20" cy="10" r="3.6" fill="#f4c453" stroke="#183a51" stroke-width="1.4"/></svg>';

  // ---------- Town ----------
  function connected(town, removed) {
    const ids = Object.keys(town.nodes), seen = new Set([ids[0]]), q = [ids[0]];
    while (q.length) for (const m of town.next(q.shift(), removed)) if (!seen.has(m)) { seen.add(m); q.push(m); }
    return seen.size === ids.length;
  }
  function makeTown(level) {
    const [C, R] = GRID[level], nodes = {}, edges = new Set();
    for (let c = 0; c < C; c++) for (let r = 0; r < R; r++) nodes[id(c, r)] = {id: id(c, r), c, r, x: 8 + c * 84 / (C - 1), y: 11 + r * 78 / (R - 1)};
    for (let c = 0; c < C; c++) for (let r = 0; r < R; r++) { if (c < C - 1) edges.add(edgeKey(id(c, r), id(c + 1, r))); if (r < R - 1) edges.add(edgeKey(id(c, r), id(c, r + 1))); }
    const town = {C, R, nodes, edges,
      has(a, b) { return edges.has(edgeKey(a, b)); },
      next(n, removed = new Set()) { const {c, r} = nodes[n]; return ORDER.map(d => id(c + DIRS[d][0], r + DIRS[d][1])).filter(m => nodes[m] && edges.has(edgeKey(n, m)) && !removed.has(edgeKey(n, m))); },
      step(n, dir) { const {c, r} = nodes[n], m = id(c + DIRS[dir][0], r + DIRS[dir][1]); return nodes[m] && edges.has(edgeKey(n, m)) ? m : null; }
    };
    // A few dead streets so the town is not a plain grid.
    let remove = {easy: 1, medium: 2, large: 3, hard: 3}[level];
    for (const e of shuffle([...edges])) {
      if (!remove) break;
      const [a, b] = e.split('|'); if (town.next(a).length <= 2 || town.next(b).length <= 2) continue;
      edges.delete(e); if (connected(town, new Set())) remove--; else edges.add(e);
    }
    // Places sit in blocks; each has a short drive to one corner (its door).
    const blocks = shuffle([...Array((C - 1) * (R - 1)).keys()]), places = shuffle(Object.keys(PLACES)).slice(0, PLACE_COUNT[level]), doors = new Set();
    town.places = [];
    for (const key of places) {
      for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i], bc = b % (C - 1), br = Math.floor(b / (C - 1));
        const door = shuffle([[bc, br], [bc + 1, br], [bc, br + 1], [bc + 1, br + 1]]).map(([c, r]) => id(c, r)).find(n => !doors.has(n));
        if (!door) continue;
        blocks.splice(i, 1); doors.add(door);
        town.places.push({key, name: PLACES[key], door, x: 8 + (bc + .5) * 84 / (C - 1), y: 11 + (br + .5) * 78 / (R - 1)});
        break;
      }
    }
    town.doorOf = Object.fromEntries(town.places.map(p => [p.door, p]));
    // Traffic lights on busy crossings that are not doors; zebra crossings on a few streets; offsets keep them out of step.
    const junctions = shuffle(Object.keys(nodes).filter(n => town.next(n).length >= 3 && !doors.has(n)));
    town.lights = junctions.slice(0, {easy: 2, medium: 3, hard: 4}[level]).map((n, i) => ({node: n, offset: i * 2.3 + Math.random() * 2}));
    town.lightAt = Object.fromEntries(town.lights.map(l => [l.node, l]));
    const streets = shuffle([...edges].filter(e => !e.split('|').some(n => town.lightAt[n])));
    town.zebras = level === 'easy' ? [] : streets.slice(0, level === 'medium' ? 2 : 3).map((e, i) => ({edge: e, offset: i * 3.1 + Math.random() * 3}));
    town.zebraOn = Object.fromEntries(town.zebras.map(z => [z.edge, z]));
    // Hard: a cyclist rides a loop round one block; the siren comes every so often.
    if (level === 'hard') {
      for (const b of shuffle([...Array((C - 1) * (R - 1)).keys()])) {
        const bc = b % (C - 1), br = Math.floor(b / (C - 1)), loop = [id(bc, br), id(bc + 1, br), id(bc + 1, br + 1), id(bc, br + 1)];
        if (loop.every((n, i) => town.has(n, loop[(i + 1) % 4]))) { town.cycleLoop = loop; break; }
      }
    }
    return town;
  }
  function route(town, from, to) {
    const prev = {[from]: null}, q = [from];
    while (q.length) { const n = q.shift(); if (n === to) break; for (const m of town.next(n)) if (!(m in prev)) { prev[m] = n; q.push(m); } }
    if (!(to in prev)) return null;
    const path = []; for (let n = to; n != null; n = prev[n]) path.unshift(n); return path;
  }
  const dirBetween = (town, a, b) => { const A = town.nodes[a], B = town.nodes[b]; return B.c > A.c ? 'right' : B.c < A.c ? 'left' : B.r > A.r ? 'down' : 'up'; };
  const turn = (dir, by) => ORDER[(ORDER.indexOf(dir) + by + 4) % 4];

  let view = null;
  class DrivingView {
    constructor(root) {
      this.root = root; this.held = false; this.clock = 0; this.raf = 0; this.tween = null;
      this.media = matchMedia('(prefers-reduced-motion: reduce)');
      this.setup = readSetup();
      this.onKey = e => this.key(e);
      document.addEventListener('keydown', this.onKey);
      this.renderSetup();
    }

    // ---------- Setup (same grammar as the Dispatch setup) ----------
    renderSetup() {
      this.stop(); els.round.textContent = '';
      const box = el('section', 'dispatch-setup driving-setup');
      const hero = el('div', 'dispatch-hero'), art = el('img'); art.src = 'images/classroom/driving-card.webp'; art.alt = ''; art.draggable = false;
      const text = el('div'); text.append(el('h3', '', 'Driving'), el('p', '', 'Drive around town and follow the road rules.'));
      hero.append(art, text); box.append(hero);
      const rows = el('div', 'dispatch-rows');
      const group = (title, items, key) => {
        const wrap = el('div', 'dispatch-options'), lid = 'driving-' + key;
        const label = el('span', 'dispatch-options__label', title); label.id = lid;
        const seg = el('div', 'dispatch-segment'); seg.setAttribute('role', 'group'); seg.setAttribute('aria-labelledby', lid);
        const hint = el('span', 'dispatch-options__hint'); hint.setAttribute('aria-live', 'polite');
        const sync = () => { const item = items.find(i => i[0] === this.setup[key]) || items[0]; hint.textContent = item[2]; for (const o of seg.children) o.setAttribute('aria-pressed', String(o.dataset.value === String(item[0]))); };
        for (const [value, label2] of items) { const b = el('button', 'dispatch-option', label2); b.type = 'button'; b.dataset.value = String(value); b.onclick = () => { this.setup[key] = value; sync(); showBest(); }; seg.append(b); }
        wrap.append(label, seg, hint); sync(); return wrap;
      };
      const best = el('p', 'dispatch-best');
      const showBest = () => { const b = readJSON(BEST, {})[`${this.setup.mode}-${this.setup.level}-${this.setup.trips}`]; best.textContent = b ? `Best: ${b.stars} of ${b.max} ⭐` : ''; best.hidden = !b; };
      rows.append(
        group('Game', Object.entries(MODES).map(([k, [l, h]]) => [k, l, h]), 'mode'),
        group('Difficulty', Object.entries(LEVELS).map(([k, [l, h]]) => [k, l, h]), 'level'),
        group('Trips', TRIPS.map(n => [n, String(n), n === 3 ? 'Quick game' : n === 5 ? 'Standard game' : 'Long game']), 'trips'));
      showBest();
      const start = el('button', 'dispatch-primary', 'Start driving'); start.type = 'button';
      start.onclick = () => { if (this.held) return; writeJSON(KEY, this.setup); this.start(); };
      box.append(rows, best, start);
      this.root.replaceChildren(box);
    }

    // ---------- Game ----------
    start() {
      const {mode, level} = this.setup;
      this.town = makeTown(level); this.trip = 0; this.stars = 0; this.bumps = 0; this.tripBumps = 0; this.queue = []; this.moving = false;
      this.clock = 0; this.between = false; this.done = false; this.siren = null; this.nextSiren = 9 + Math.random() * 6; this.waitNote = '';
      const free = Object.keys(this.town.nodes).filter(n => !this.town.doorOf[n] && !this.town.lightAt[n]);
      this.car = pick(free); this.heading = this.town.next(this.car).map(m => dirBetween(this.town, this.car, m))[0] || 'right';
      if (mode === 'taxi') this.rider = null;
      this.build(); this.newTrip(); this.loop();
    }

    build() {
      const t = this.town, mode = this.setup.mode;
      const shell = el('section', `driving is-${mode}`); this.shell = shell;
      const head = el('div', 'dispatch-head'); this.titleEl = el('h3', 'dispatch-title'); this.countEl = el('span', 'dispatch-count');
      const words = el('div'); words.append(this.titleEl); head.append(words, this.countEl);
      const world = el('div', 'driving-world'); this.world = world;
      const svg = svgEl('svg', {viewBox: '0 0 100 100', preserveAspectRatio: 'none', 'aria-hidden': 'true'});
      const xy = n => [t.nodes[n].x, t.nodes[n].y];
      for (const p of t.places) { const [dx, dy] = xy(p.door); svg.append(svgEl('path', {class: 'dv-drive', d: `M${p.x} ${p.y} L${dx} ${p.y} L${dx} ${dy}`})); }
      for (const cls of ['dv-road-edge', 'dv-road', 'dv-centre']) for (const e of t.edges) { const [a, b] = e.split('|'); const [ax, ay] = xy(a), [bx, by] = xy(b); svg.append(svgEl('path', {class: cls, d: `M${ax} ${ay} L${bx} ${by}`})); }
      this.planEl = svgEl('path', {class: 'dv-plan', d: ''}); svg.append(this.planEl);
      world.append(svg);
      this.plotEls = {};
      for (const p of t.places) {
        const plot = el('span', 'dv-plot'); plot.style.left = p.x + '%'; plot.style.top = p.y + '%'; plot.setAttribute('aria-hidden', 'true');
        const img = el('img'); img.src = `images/dispatch-map/landmark-${p.key}.webp`; img.alt = ''; img.draggable = false;
        plot.append(img, el('span', 'dw-label', p.name)); world.append(plot); this.plotEls[p.key] = plot;
      }
      this.zebraEls = t.zebras.map(z => {
        const [a, b] = z.edge.split('|'), [ax, ay] = xy(a), [bx, by] = xy(b), across = ay === by;
        const zeb = el('span', `dv-zebra ${across ? 'is-v' : 'is-h'}`); zeb.style.left = (ax + bx) / 2 + '%'; zeb.style.top = (ay + by) / 2 + '%';
        const walker = el('span', 'dv-walker'); walker.innerHTML = personSVG(pick(['#d6604d', '#4f8fc0', '#7bb661', '#c58ad8'])); zeb.append(walker);
        world.append(zeb); return {z, zeb, walker, across};
      });
      this.lightEls = t.lights.map(l => {
        const [x, y] = xy(l.node), lamp = el('span', t.nodes[l.node].r === t.R - 1 ? 'dv-light is-above' : 'dv-light'); lamp.style.left = x + '%'; lamp.style.top = y + '%'; lamp.setAttribute('aria-hidden', 'true');
        lamp.append(el('i'), el('i')); world.append(lamp); return {l, lamp};
      });
      this.nodeEls = {};
      for (const n of Object.values(t.nodes)) {
        const b = el('button', 'dw-node dv-node'); b.type = 'button'; b.style.left = n.x + '%'; b.style.top = n.y + '%';
        b.setAttribute('aria-label', t.doorOf[n.id] ? t.doorOf[n.id].name : `Crossing ${n.r + 1}-${n.c + 1}`);
        b.onclick = () => this.tap(n.id); this.nodeEls[n.id] = b; world.append(b);
      }
      if (t.cycleLoop) { this.cyclist = el('span', 'dv-cyclist'); this.cyclist.innerHTML = cyclistSVG; world.append(this.cyclist); }
      this.amb = el('span', 'dv-ambulance'); const ai = el('img'); ai.src = 'images/dispatch/ambulance.webp'; ai.alt = ''; this.amb.append(ai); this.amb.hidden = true; world.append(this.amb);
      this.carEl = el('span', 'dv-car'); this.carEl.innerHTML = mode === 'taxi' ? '<img src="images/dispatch/taxi.webp" alt="">' : carSVG(mode === 'park' ? '#4f8fc0' : '#d6504a');
      world.append(this.carEl);
      this.pos = {x: t.nodes[this.car].x, y: t.nodes[this.car].y, a: ANGLE[this.heading]}; this.targetA = this.pos.a;
      this.statusEl = el('p', 'dispatch-status driving-status'); this.statusEl.setAttribute('role', 'status');
      shell.append(head, world, this.statusEl);
      if (mode === 'park') {
        this.padEl = el('div', 'driving-actions'); this.padEl.setAttribute('role', 'group'); this.padEl.setAttribute('aria-label', 'Driving actions');
        for (const [k, label] of Object.entries(ACTIONS)) { const b = el('button', 'driving-action', label); b.type = 'button'; b.dataset.action = k; b.onclick = () => this.act(k); this.padEl.append(b); }
        shell.append(this.padEl);
      } else {
        const pad = el('div', 'driving-pad'); pad.setAttribute('role', 'group'); pad.setAttribute('aria-label', 'Drive');
        for (const [d, sym, label] of [['up', '▲', 'Drive up'], ['left', '◀', 'Drive left'], ['right', '▶', 'Drive right'], ['down', '▼', 'Drive down']]) {
          const b = el('button', `driving-arrow is-${d}`, sym); b.type = 'button'; b.setAttribute('aria-label', label); b.onclick = () => this.press(d); pad.append(b);
        }
        shell.append(pad);
      }
      const tools = el('div', 'dispatch-actions'), restart = el('button', 'dispatch-secondary', 'New town'); restart.type = 'button';
      restart.onclick = () => { if (!this.held) this.start(); };
      const settings = el('button', 'dispatch-secondary', 'Change settings'); settings.type = 'button'; settings.onclick = () => { if (!this.held) this.renderSetup(); };
      tools.append(restart, settings); shell.append(tools);
      this.root.replaceChildren(shell);
      this.resize = new ResizeObserver(() => this.fit()); this.resize.observe(world); this.fit(); this.paint();
    }

    fit() {
      const r = this.world?.getBoundingClientRect(); if (!r?.width) return;
      const t = this.town, bw = r.width * .84 / (t.C - 1), bh = r.height * .78 / (t.R - 1);
      this.world.style.setProperty('--block', Math.min(bw, bh) + 'px');
    }

    newTrip() {
      const t = this.town, mode = this.setup.mode; this.tripBumps = 0; this.queue = []; this.between = false;
      for (const p of Object.values(this.plotEls)) p.classList.remove('is-dest', 'is-from');
      if (mode === 'park') return this.newCommands();
      const here = t.doorOf[this.car]?.key;
      if (mode === 'safe') {
        this.dest = pick(t.places.filter(p => p.key !== here && p.key !== this.dest?.key));
        this.titleEl.textContent = `Drive to the ${this.dest.name}.`;
        this.plotEls[this.dest.key].classList.add('is-dest');
      } else {
        const from = pick(t.places.filter(p => p.door !== this.car)), to = pick(t.places.filter(p => p !== from)), who = pick(RIDERS);
        this.rider = {from, to, who, aboard: false}; this.dest = from;
        this.titleEl.textContent = `${who[1]} is waiting at the ${from.name}.`;
        this.plotEls[from.key].classList.add('is-from');
      }
      this.say(mode === 'taxi' ? `Drive to the ${this.dest.name} to pick them up.` : 'Use the arrows, or tap a crossing to drive there.');
      this.update();
    }

    // Park and Go: a short list of action words that ends in a parking space.
    newCommands() {
      const t = this.town, level = this.setup.level, len = {easy: 4, medium: 6, hard: 8}[level];
      let node = this.car, dir = this.heading; const list = [];
      while (list.length < len - 1) {
        const opts = [];
        for (const [k, by] of [['forward', 0], ['left', -1], ['right', 1]]) { const d = turn(dir, by), m = t.step(node, d); if (m) opts.push({k, m, d}); }
        const back = t.step(node, turn(dir, 2)); if (back && list[list.length - 1]?.k !== 'forward' && Math.random() < .2) opts.push({k: 'reverse', m: back, d: dir});
        if (!opts.length) { const m = t.step(node, turn(dir, 2)); if (!m) break; list.push({k: 'reverse', m, d: dir}); node = m; continue; }
        const o = pick(opts.filter(o => o.k !== 'forward').length && Math.random() < .55 ? opts.filter(o => o.k !== 'forward') : opts);
        list.push(o); node = o.m; dir = o.d;
        if (level !== 'easy' && list.length === Math.floor(len / 2)) list.push({k: 'stop'});
      }
      list.push({k: 'park', m: node});
      this.commands = list; this.cmd = 0; this.parkAt = node;
      this.titleEl.textContent = 'Follow the action words, then park.';
      this.say(`${ACTIONS[list[0].k]}.`);
      this.update();
    }

    // ---------- Input ----------
    key(e) {
      if (!this.shell?.isConnected || this.held || e.altKey || e.ctrlKey || e.metaKey) return;
      if (document.querySelector('dialog[open]') || /INPUT|SELECT|TEXTAREA/.test(document.activeElement?.tagName)) return;
      const k = e.key, arrows = {ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right'};
      if (this.setup.mode === 'park') {
        const map = {ArrowUp: 'forward', ArrowLeft: 'left', ArrowRight: 'right', ArrowDown: 'reverse', ' ': 'stop', p: 'park', P: 'park'};
        if (map[k]) { e.preventDefault(); this.act(map[k]); }
      } else if (arrows[k]) { e.preventDefault(); if (!e.repeat || !this.moving) this.press(arrows[k]); }
    }

    press(dir) {
      if (this.held || this.done || this.between) return;
      const next = this.town.step(this.queue.length ? this.queue[this.queue.length - 1] : this.car, dir);
      if (!next) { this.say('There is no road that way.'); return; }
      if (this.moving) { if (this.queue.length < 2) this.queue.push(next); return; }
      this.queue = [next]; this.manual = true; this.drive();
    }

    tap(n) {
      if (this.held || this.done || this.between || this.setup.mode === 'park') return;
      if (n === this.car) { this.arrive(); return; }
      const path = route(this.town, this.car, n); if (!path) return;
      this.queue = path.slice(1);
      this.manual = false; if (!this.moving) this.drive();
    }

    // A hazard on the next street: red light, people on the zebra, the cyclist, or a siren.
    hazard(a, b) {
      const t = this.town, light = t.lightAt[b], zebra = t.zebraOn[edgeKey(a, b)];
      if (this.siren) return ['siren', 'Siren! Pull over and let the ambulance pass.'];
      if (light && this.lightRed(light)) return ['red', 'Red light. Stop and wait for green.'];
      if (zebra && this.zebraBusy(zebra)) return ['zebra', 'People are crossing. Wait at the zebra crossing.'];
      if (this.cycleEdge && (this.cycleEdge === edgeKey(a, b) || this.cycleNode === b)) return ['cyclist', 'A cyclist is ahead. Wait and give them space.'];
      return null;
    }

    drive() {
      if (!this.queue.length || this.done) { this.moving = false; this.planEl.setAttribute('d', ''); return; }
      const a = this.car, b = this.queue[0], risk = this.hazard(a, b);
      if (risk) {
        // Arrow keys: the driver tried to go, so the rule is explained and counted. Tapped routes wait by themselves.
        if (this.manual) { this.queue = []; this.moving = false; this.bump(risk[1]); return; }
        this.moving = false; this.waiting = risk; this.say(risk[1] + ' The car waits.'); return;
      }
      this.waiting = null; this.moving = true; this.queue.shift();
      const dir = dirBetween(this.town, a, b); this.turnTo(dir);
      this.car = b; this.plan();
      this.go({x: this.town.nodes[b].x, y: this.town.nodes[b].y}, () => { this.arrive(); this.drive(); });
    }

    turnTo(dir) { let target = ANGLE[dir]; while (target - this.pos.a > 180) target -= 360; while (target - this.pos.a < -180) target += 360; this.heading = dir; this.targetA = target; }

    go(to, done, reverse = false) {
      this.tween?.kill(); to = {...to, a: this.targetA ?? this.pos.a};
      const finish = () => { this.tween = null; done(); };
      if (this.media.matches || !window.gsap) { Object.assign(this.pos, to); this.paint(); finish(); return; }
      this.tween = gsap.to(this.pos, {...to, duration: reverse ? STEP * 1.4 : STEP, ease: 'power1.inOut', onUpdate: () => this.paint(), onComplete: finish});
      if (this.held) this.tween.pause();
    }

    arrive() {
      const t = this.town, mode = this.setup.mode, here = t.doorOf[this.car];
      if (mode === 'safe' && here?.key === this.dest.key) { this.queue = []; this.tripDone(`You reached the ${here.name}.`); }
      else if (mode === 'taxi' && here) {
        if (!this.rider.aboard && here === this.rider.from) {
          this.queue = []; this.rider.aboard = true; this.dest = this.rider.to;
          this.plotEls[here.key].classList.remove('is-from'); this.plotEls[this.dest.key].classList.add('is-dest');
          this.titleEl.textContent = `Take ${this.rider.who[1].replace(/^A /, 'the ').replace(/^An /, 'the ')} to the ${this.dest.name}.`;
          this.say('Hop in! Buckle up.'); this.update();
        } else if (this.rider.aboard && here === this.rider.to) { this.queue = []; this.tripDone(`Thank you! You took them to the ${here.name}.`); }
      }
    }

    act(k) {
      if (this.held || this.done || this.between || this.moving || !this.commands) return;
      const want = this.commands[this.cmd];
      if (k !== want.k) { this.bump(`That was ${ACTIONS[k].toLowerCase()}. This time: ${ACTIONS[want.k].toLowerCase()}.`); this.flash(want.k); return; }
      const next = () => { this.cmd++; if (this.cmd >= this.commands.length) return; this.say(`${ACTIONS[this.commands[this.cmd].k]}.`); this.update(); };
      if (k === 'stop') { this.moving = true; this.say('Stopped. Well done.'); setTimeout(() => { this.moving = false; if (this.shell?.isConnected && !this.done) next(); }, 600); return; }
      if (k === 'park') { this.tripDone('Parked in the space. Well done!'); return; }
      this.moving = true;
      if (k !== 'reverse') this.turnTo(want.d);
      this.car = want.m;
      this.go({x: this.town.nodes[want.m].x, y: this.town.nodes[want.m].y}, () => { this.moving = false; next(); }, k === 'reverse');
      this.update();
    }

    flash(k) { const b = this.padEl?.querySelector(`[data-action="${k}"]`); if (!b) return; b.classList.remove('is-hint'); void b.offsetWidth; b.classList.add('is-hint'); }

    bump(text) { this.bumps++; this.tripBumps++; this.say(text); this.carEl.classList.remove('is-bump'); void this.carEl.offsetWidth; this.carEl.classList.add('is-bump'); }

    tripDone(text) {
      const got = this.tripBumps === 0 ? 3 : this.tripBumps === 1 ? 2 : 1;
      this.stars += got; this.trip++; this.between = true; this.say(`${text} ${'⭐'.repeat(got)}`); this.moving = false;
      if (this.trip >= this.setup.trips) { this.done = true; setTimeout(() => this.shell?.isConnected && this.finish(), 1200); return; }
      this.update();
      setTimeout(() => { if (this.shell?.isConnected && !this.done) this.newTrip(); }, 1100);
    }

    finish() {
      this.stop();
      const max = this.setup.trips * 3, key = `${this.setup.mode}-${this.setup.level}-${this.setup.trips}`, bests = readJSON(BEST, {}), prev = bests[key];
      if (!prev || this.stars > prev.stars) { bests[key] = {stars: this.stars, max}; writeJSON(BEST, bests); }
      const box = el('section', 'dispatch-setup dispatch-done');
      box.append(el('h3', '', 'Well driven!'), el('p', 'dispatch-done-score', `${this.stars} of ${max} ⭐`));
      box.append(el('p', '', this.bumps === 0 ? 'A perfectly safe driver: no rules missed.' : `Rules to remember next time: ${this.bumps}.`));
      if (prev && this.stars <= prev.stars) box.append(el('p', 'dispatch-best', `Best: ${prev.stars} of ${prev.max} ⭐`));
      const again = el('button', 'dispatch-primary', 'Play again'); again.type = 'button'; again.onclick = () => { if (!this.held) { this.done = false; this.start(); } };
      const change = el('button', 'dispatch-secondary', 'Change settings'); change.type = 'button'; change.onclick = () => { if (!this.held) { this.done = false; this.renderSetup(); } };
      const row = el('div', 'dispatch-actions'); row.append(again, change); box.append(row);
      this.root.replaceChildren(box);
      if (typeof burstConfetti === 'function') burstConfetti();
    }

    say(text) { if (this.statusEl) this.statusEl.textContent = text; }

    plan() {
      const t = this.town, pts = [this.car, ...this.queue].map(n => `${t.nodes[n].x} ${t.nodes[n].y}`);
      this.planEl.setAttribute('d', this.queue.length && !this.manual ? 'M' + pts.join(' L') : '');
    }

    update() {
      if (!this.shell?.isConnected) return;
      const t = this.town, mode = this.setup.mode;
      this.countEl.textContent = `Trip ${Math.min(this.trip + 1, this.setup.trips)} of ${this.setup.trips} · ⭐ ${this.stars}`;
      els.round.textContent = '';
      for (const [n, b] of Object.entries(this.nodeEls)) {
        b.classList.toggle('is-dest', mode !== 'park' && this.dest && n === this.dest.door);
        b.classList.toggle('is-park', mode === 'park' && n === this.parkAt);
        b.disabled = mode === 'park';
      }
      if (this.padEl) for (const b of this.padEl.children) b.classList.toggle('is-next', this.setup.level === 'easy' && this.commands?.[this.cmd]?.k === b.dataset.action);
    }

    // ---------- World clock: lights, walkers, cyclist, siren ----------
    lightRed(l) { const p = (this.clock + l.offset) % 9; return p >= 5; }
    zebraBusy(z) { const p = (this.clock + z.offset) % 8; return p >= 5; }
    loop() {
      cancelAnimationFrame(this.raf);
      let last = performance.now();
      const tick = now => {
        if (!this.shell?.isConnected) return;
        const dt = Math.min(.1, (now - last) / 1000); last = now;
        if (!this.held && !this.done) this.clock += dt;
        this.tickWorld(); this.raf = requestAnimationFrame(tick);
      };
      this.raf = requestAnimationFrame(tick);
    }
    tickWorld() {
      const t = this.town, c = this.clock;
      for (const {l, lamp} of this.lightEls) { const red = this.lightRed(l); lamp.classList.toggle('is-red', red); lamp.classList.toggle('is-green', !red); }
      for (const {z, walker, across} of this.zebraEls) {
        const p = (c + z.offset) % 8, busy = p >= 5, f = busy ? (p - 5) / 3 : 0;
        walker.hidden = !busy; walker.style.transform = across ? `translate(-50%,${-120 + f * 240}%)` : `translate(${-120 + f * 240}%,-50%) rotate(90deg)`;
      }
      if (t.cycleLoop) {
        const L = t.cycleLoop, seg = (c * .22) % 4, i = Math.floor(seg), f = seg - i, a = t.nodes[L[i]], b = t.nodes[L[(i + 1) % 4]];
        this.cycleEdge = edgeKey(L[i], L[(i + 1) % 4]); this.cycleNode = f > .7 ? L[(i + 1) % 4] : L[i];
        const ang = b.x > a.x ? 0 : b.x < a.x ? 180 : b.y > a.y ? 90 : 270;
        this.cyclist.style.left = a.x + (b.x - a.x) * f + '%'; this.cyclist.style.top = a.y + (b.y - a.y) * f + '%'; this.cyclist.style.transform = `translate(-50%,-50%) rotate(${ang}deg) translateY(-30%)`;
      }
      if (this.setup.level === 'hard') {
        if (!this.siren && c > this.nextSiren && !this.done) { const r = Math.floor(Math.random() * t.R); this.siren = {start: c, row: r}; this.amb.hidden = false; this.shell.classList.add('is-siren'); this.say('Siren! Pull over and stop until the ambulance has passed.'); }
        if (this.siren) {
          const f = (c - this.siren.start) / 4, y = t.nodes[id(0, this.siren.row)].y;
          this.amb.style.left = -8 + f * 116 + '%'; this.amb.style.top = y + '%';
          if (f >= 1) { this.siren = null; this.amb.hidden = true; this.shell.classList.remove('is-siren'); this.nextSiren = c + 14 + Math.random() * 8; this.say('The ambulance has passed. Drive on.'); }
        }
      }
      // A tapped route that was waiting moves on once the way is clear.
      if (this.waiting && !this.moving && !this.held && this.queue.length && !this.hazard(this.car, this.queue[0])) this.drive();
    }

    paint() {
      if (!this.carEl) return;
      this.carEl.style.left = this.pos.x + '%'; this.carEl.style.top = this.pos.y + '%';
      this.carEl.style.transform = `translate(-50%,-50%) rotate(${this.pos.a}deg)`;
    }

    stop() { cancelAnimationFrame(this.raf); this.tween?.kill(); this.tween = null; this.resize?.disconnect(); this.shell = null; this.moving = false; this.queue = []; }
    setHeld(held) { this.held = held; if (held) this.tween?.pause(); else this.tween?.resume(); }
    destroy() { this.stop(); document.removeEventListener('keydown', this.onKey); }
  }

  globalThis.TransportDriving = {
    mount(root) { this.destroy(); document.getElementById('gameCard')?.setAttribute('data-mode', 'dispatch'); view = new DrivingView(root); if (globalThis.__drivingHeld) view.setHeld(true); },
    setHeld(held) { globalThis.__drivingHeld = held; view?.setHeld(held); },
    destroy() { view?.destroy(); view = null; },
    _view: () => view
  };
})();
