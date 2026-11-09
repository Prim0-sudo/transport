// Transport Dispatch: choose a suitable vehicle, load, plan an open route, deliver, unload.
// Follows docs/DISPATCH-DETAILED-PREVIEW.md. The town is drawn in code for now; painted Miniature World
// planes and directional vehicle sprites replace the drawing and the markers later without changing the rules.
(() => {
  const N = {depot:[14,80],w1:[7,62],w2:[7,30],nw:[15,21],school:[32,21],tw:[49,21],te:[71,21],e:[80,32],station:[90,19],hospital:[89,55],
    bw:[30,71],b1:[50,52],b2:[70,47],dock:[46,90],sea:[66,96],island:[85,86]};
  const ROAD = {tunnel:['depot','w1','w2','nw','school','tw','te','e'], bridge:['depot','bw','b1','b2','e']};
  const STOPS = {
    depot:{queue:[[6,90],3,0], label:[4,93]}, dock:{queue:[[28,95],3,0], label:[27,85]},
    school:{queue:[[25,13],3,0], label:[23,4]}, station:{queue:[[80,10],3,0], label:[78,1]},
    hospital:{queue:[[80,64],3,0], label:[78,68]}, island:{queue:[[78,79],3,0], label:[76,93]}
  };
  const PLACE_NAMES = {depot:'Depot',dock:'Ferry dock',school:'School',station:'Station',hospital:'Hospital',island:'Island harbour'};
  const VEHICLES = {
    bus:{word:'vehicle.bus',label:'Bus',info:'12 seats · road',color:'#f4c453'},
    van:{word:'vehicle.van',label:'Van',info:'2 seats · road',color:'#ef8f6e'},
    ferry:{word:'vehicle.ferry',label:'Ferry',info:'Many seats · water',color:'#6cb4dc'},
    truck:{word:'vehicle.truck',label:'Truck',info:'Heavy loads · road',color:'#9cc97a'},
    tractor:{word:'vehicle.tractor',label:'Tractor',info:'1 seat · farm work',color:'#c7a04e'},
    ambulance:{word:'vehicle.ambulance',label:'Ambulance',info:'Medical help · road',color:'#fdfdfd'}
  };
  const MISSIONS = [
    {id:'crowd', start:'depot', dest:'station', count:6, kind:'people', answer:'bus', choices:['bus','van','ferry'], pickup:2,
      title:n=>`Take ${n} passengers to the station`, load:'Load passengers', unload:'Unload passengers',
      right:'The bus has 12 seats, enough for everyone.', wrong:{van:'The van has only 2 seats. Six passengers need more seats.', ferry:'The ferry travels on water. This journey goes by road.'}},
    {id:'pair', start:'depot', dest:'school', count:2, kind:'people', answer:'van', choices:['tractor','van','ferry'],
      title:()=>'Take 2 passengers to the school', load:'Load passengers', unload:'Unload passengers',
      right:'The van has 2 seats, just right for two passengers.', wrong:{tractor:'The tractor has one seat, just for the driver. It works on farms.', ferry:'The ferry travels on water. The school is by road.'}},
    {id:'bricks', start:'depot', dest:'station', count:4, kind:'cargo', answer:'truck', choices:['bus','van','truck'],
      title:()=>'Take a heavy load of bricks to the station', load:'Load the bricks', unload:'Unload the bricks',
      right:'The truck is built to carry heavy loads.', wrong:{bus:'Buses carry passengers, not heavy loads of bricks.', van:'The van is too small for a heavy load of bricks.'}},
    {id:'island', start:'dock', dest:'island', count:8, kind:'people', answer:'ferry', choices:['bus','ferry','van'], sea:true,
      title:()=>'Take 8 passengers across the water to the island', load:'Load passengers', unload:'Unload passengers',
      right:'The ferry carries passengers across the water.', wrong:{bus:'Buses drive on roads. The island is across the water.', van:'Vans drive on roads. The island is across the water.'}},
    {id:'unwell', start:'depot', dest:'hospital', count:1, kind:'patient', answer:'ambulance', choices:['tractor','ferry','ambulance'],
      title:()=>'Someone feels very unwell. Take them to the hospital', load:'Help them aboard', unload:'Help them inside',
      right:'The ambulance has medical help on board.', wrong:{tractor:'The tractor is for farm work. Someone unwell needs medical help on the way.', ferry:'The ferry travels on water. The hospital is by road.'}}
  ];
  const LEVELS = {easy:['Easy','Both roads open'], medium:['Medium','The bridge is closed'], hard:['Hard','A road is closed and some trips stop at the school']};
  const LENGTHS = [3,5,7];
  const KEY = 'transport-dispatch-setup';
  const SECONDS = 6;

  const el = (tag, className, text) => { const n = document.createElement(tag); if (className) n.className = className; if (text != null) n.textContent = text; return n; };
  const svgEl = (tag, attrs) => { const n = document.createElementNS('http://www.w3.org/2000/svg', tag); for (const k in attrs) n.setAttribute(k, attrs[k]); return n; };
  function smooth(points, r = 5) {
    const p = points.map(id => typeof id === 'string' ? N[id] : id);
    let d = `M${p[0][0]} ${p[0][1]}`;
    for (let i = 1; i < p.length - 1; i++) {
      const [a, b, c] = [p[i - 1], p[i], p[i + 1]];
      const la = Math.hypot(b[0] - a[0], b[1] - a[1]), lc = Math.hypot(c[0] - b[0], c[1] - b[1]), k = Math.min(r, la / 2, lc / 2);
      const s = [b[0] - (b[0] - a[0]) / la * k, b[1] - (b[1] - a[1]) / la * k], t = [b[0] + (c[0] - b[0]) / lc * k, b[1] + (c[1] - b[1]) / lc * k];
      d += ` L${s[0].toFixed(2)} ${s[1].toFixed(2)} Q${b[0]} ${b[1]} ${t[0].toFixed(2)} ${t[1].toFixed(2)}`;
    }
    const last = p[p.length - 1]; return d + ` L${last[0]} ${last[1]}`;
  }
  const readSetup = () => { try { const s = JSON.parse(localStorage.getItem(KEY) || '{}'); return {level: LEVELS[s.level] ? s.level : 'medium', length: LENGTHS.includes(s.length) ? s.length : 5}; } catch { return {level:'medium', length:5}; } };
  const saveSetup = s => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} };
  const shuffle = list => { const a = [...list]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const wordFor = id => (typeof transportWords !== 'undefined' ? transportWords : []).find(w => w.id === id);

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
      box.append(el('h3', '', 'Transport Dispatch'), el('p', '', 'Choose the right vehicle, plan an open road and deliver everyone safely.'));
      const group = (title, items, current, pick) => {
        const wrap = el('div', 'dispatch-options'); wrap.setAttribute('role', 'group'); wrap.setAttribute('aria-label', title);
        wrap.append(el('h4', '', title));
        for (const [value, label, hint] of items) {
          const b = el('button', 'dispatch-option'); b.type = 'button'; b.setAttribute('aria-pressed', String(value === current));
          b.append(el('strong', '', label)); if (hint) b.append(el('span', '', hint));
          b.onclick = () => { pick(value); for (const o of wrap.querySelectorAll('button')) o.setAttribute('aria-pressed', String(o === b)); };
          wrap.append(b);
        }
        return wrap;
      };
      box.append(
        group('Difficulty', Object.entries(LEVELS).map(([k, [l, h]]) => [k, l, h]), this.setup.level, v => this.setup.level = v),
        group('Deliveries', LENGTHS.map(n => [n, `${n} deliveries`, n === 3 ? 'Short round' : n === 5 ? 'Medium round' : 'Long round']), this.setup.length, v => this.setup.length = v));
      const start = el('button', 'dispatch-primary', 'Start dispatching'); start.type = 'button';
      start.onclick = () => { if (this.held) return; saveSetup(this.setup); this.startRound(); };
      box.append(start);
      this.root.replaceChildren(box);
    }

    startRound() {
      const base = shuffle(MISSIONS); const list = [...base];
      while (list.length < this.setup.length) { const pick = shuffle(MISSIONS).find(m => m !== list[list.length - 1]); list.push(pick); }
      this.missions = list.slice(0, this.setup.length); this.index = 0; this.earned = 0; this.fixes = 0;
      this.buildBoard(); this.startMission();
    }

    buildBoard() {
      const r = this.root; r.replaceChildren();
      const shell = el('section', 'dispatch'); this.shell = shell;
      const head = el('div', 'dispatch-head'); this.titleEl = el('h3', 'dispatch-title'); this.subEl = el('p', 'dispatch-sub'); this.countEl = el('span', 'dispatch-count');
      const words = el('div'); words.append(this.titleEl, this.subEl); head.append(words, this.countEl);
      const world = el('div', 'dispatch-world'); world.setAttribute('role', 'img'); this.world = world;
      const svg = svgEl('svg', {viewBox:'0 0 100 100', preserveAspectRatio:'none', 'aria-hidden':'true'}); this.svg = svg;
      svg.append(
        svgEl('path', {class:'dw-water', d:'M54 0 H66 C66 28 67 52 71 68 C80 72 90 72 100 71 V100 H54 C57 88 57 72 56 56 C55 36 54 18 54 0 Z'}),
        svgEl('ellipse', {class:'dw-island', cx:86, cy:86, rx:11, ry:8}),
        svgEl('path', {class:'dw-lane', d:smooth(['dock','sea','island'], 8)}),
        svgEl('path', {class:'dw-road', d:smooth(ROAD.tunnel.slice(0, 6))}),
        svgEl('path', {class:'dw-road dw-under', d:smooth(['tw','te'])}),
        svgEl('path', {class:'dw-road', d:smooth(['te','e'])}),
        svgEl('path', {class:'dw-road', d:smooth(ROAD.bridge)}),
        svgEl('path', {class:'dw-road', d:smooth(['e','station'])}),
        svgEl('path', {class:'dw-road', d:smooth(['e','hospital'])}),
        svgEl('path', {class:'dw-road', d:smooth(['depot',[30,86],'dock'])}),
        svgEl('path', {class:'dw-deck', d:smooth(['b1','b2'])}),
        svgEl('path', {class:'dw-centre', d:smooth(ROAD.tunnel.slice(0, 6))}),
        svgEl('path', {class:'dw-centre', d:smooth(['te','e'])}),
        svgEl('path', {class:'dw-centre', d:smooth(ROAD.bridge)}),
        svgEl('path', {class:'dw-centre', d:smooth(['e','station'])}),
        svgEl('path', {class:'dw-centre', d:smooth(['e','hospital'])}),
        svgEl('rect', {class:'dw-portal', x:47.5, y:17.5, width:3, height:7, rx:1.4}),
        svgEl('rect', {class:'dw-portal', x:69.5, y:17.5, width:3, height:7, rx:1.4}));
      for (const [id, s] of Object.entries(STOPS)) {
        const [[x, y]] = s.queue; svg.append(svgEl('rect', {class:'dw-platform', x:x - 2, y:y - 3, width:16, height:6, rx:1.5}));
        const label = el('span', 'dw-place', PLACE_NAMES[id]); label.style.left = s.label[0] + '%'; label.style.top = s.label[1] + '%'; world.append(label);
      }
      const roadLabel = (text, x, y) => { const l = el('span', 'dw-road-name', text); l.style.left = x + '%'; l.style.top = y + '%'; world.append(l); return l; };
      roadLabel('Tunnel', 56, 12); roadLabel('Bridge', 54, 56);
      this.closedEl = { bridge: el('span', 'dw-closed', 'Bridge closed'), tunnel: el('span', 'dw-closed', 'Tunnel closed') };
      Object.assign(this.closedEl.bridge.style, {left:'47%', top:'42%'}); Object.assign(this.closedEl.tunnel.style, {left:'50%', top:'26%'});
      world.prepend(svg); world.append(this.closedEl.bridge, this.closedEl.tunnel);
      this.actor = el('div', 'dw-actor'); this.actor.setAttribute('aria-hidden', 'true'); world.append(this.actor);
      this.loads = Array.from({length: 10}, () => { const m = el('i', 'dw-load'); m.setAttribute('aria-hidden', 'true'); world.append(m); return {el: m, x: 0, y: 0, a: 0}; });
      this.choicesEl = el('div', 'dispatch-vehicles'); this.choicesEl.setAttribute('role', 'group'); this.choicesEl.setAttribute('aria-label', 'Vehicles');
      this.routesEl = el('div', 'dispatch-routes'); this.routesEl.setAttribute('role', 'group'); this.routesEl.setAttribute('aria-label', 'Roads');
      this.routeButtons = {};
      for (const id of ['bridge', 'tunnel']) { const b = el('button', 'dispatch-route'); b.type = 'button'; b.onclick = () => this.pickRoute(id); this.routeButtons[id] = b; this.routesEl.append(b); }
      this.statusEl = el('p', 'dispatch-status'); this.statusEl.setAttribute('role', 'status'); this.statusEl.setAttribute('aria-live', 'polite');
      const actions = el('div', 'dispatch-actions');
      this.primary = el('button', 'dispatch-primary'); this.primary.type = 'button'; this.primary.onclick = () => this.advance();
      this.restartBtn = el('button', 'dispatch-secondary', 'Restart delivery'); this.restartBtn.type = 'button'; this.restartBtn.onclick = () => { if (!this.held) this.startMission(true); };
      actions.append(this.primary, this.restartBtn);
      shell.append(head, world, this.choicesEl, this.routesEl, this.statusEl, actions); r.append(shell);
      this.size = {w: 1, h: 1};
      this.resize = new ResizeObserver(([entry]) => { this.size = {w: entry.contentRect.width, h: entry.contentRect.height}; this.paint(); });
      this.resize.observe(world);
    }

    startMission(restart = false) {
      this.stopMotion();
      const m = this.mission = this.missions[this.index];
      const level = this.setup.level;
      this.count = m.count; this.pickup = level === 'hard' && m.pickup ? m.pickup : 0;
      this.closed = level === 'easy' || m.sea ? null : level === 'medium' || this.pickup || m.dest === 'school' ? 'bridge' : (restart && this.closed) || (Math.random() < .5 ? 'bridge' : 'tunnel');
      this.phase = 'choose'; this.vehicle = null; this.route = null; this.onboard = 0; this.schoolDone = false; this.mistakes = this.mistakes && restart ? this.mistakes : 0;
      const [sx, sy] = N[m.start]; this.pos = {x: sx, y: sy, rotation: m.sea ? 20 : 0};
      const [[qx, qy]] = STOPS[m.start].queue;
      this.loads.forEach((p, i) => {
        const school = i >= m.count && i < m.count + this.pickup;
        const active = i < m.count || school;
        const [bx, by] = school ? STOPS.school.queue[0] : [qx, qy];
        const k = school ? i - m.count : i;
        Object.assign(p, {x: bx + (k % 6) * 2.4, y: by + Math.floor(k / 6) * 3, a: active ? 1 : 0, active});
        p.el.className = `dw-load dw-load--${m.kind}`;
      });
      this.titleEl.textContent = this.pickup ? `Collect ${this.pickup} at the school, then take ${m.count + this.pickup} passengers to the station` : m.title(m.count);
      this.world.setAttribute('aria-label', `Town map. ${PLACE_NAMES[m.start]} to ${PLACE_NAMES[m.dest]}.${this.closed ? ` The ${this.closed} is closed.` : ''}`);
      this.choicesEl.replaceChildren();
      for (const id of m.choices) {
        const v = VEHICLES[id], word = wordFor(v.word), b = el('button', 'dispatch-vehicle'); b.type = 'button'; b.dataset.vehicle = id;
        if (word?.image) { const img = el('img'); img.src = word.image; img.alt = ''; b.append(img); }
        b.append(el('strong', '', v.label), el('small', '', v.info));
        b.onclick = () => this.pickVehicle(id); this.choicesEl.append(b);
      }
      this.say(m.sea ? 'Choose a vehicle for a trip across the water.' : `Choose a vehicle for this ${m.kind === 'cargo' ? 'load' : 'trip'}.`);
      this.update();
    }

    say(text) { this.statusEl.textContent = text; }
    busy() { return ['boarding', 'travelling', 'unloading', 'pickup'].includes(this.phase); }

    pickVehicle(id) {
      if (this.held || this.phase !== 'choose') return;
      const m = this.mission;
      if (id !== m.answer) { this.mistakes++; this.vehicle = null; this.say(m.wrong[id]); this.update(id); return; }
      this.vehicle = id; this.say(`${m.right} ${m.load} when ready.`); this.update();
    }

    pickRoute(id) {
      if (this.held || !['route', 'ready'].includes(this.phase)) return;
      const m = this.mission;
      if (m.dest === 'school' && id === 'bridge') { this.mistakes++; this.say('The bridge road crosses the river. The school is on the tunnel road, on this side.'); return; }
      if (id === this.closed) { this.mistakes++; this.say(`The ${id} is closed today. Keep the ${VEHICLES[this.vehicle].label.toLowerCase()} at the depot and choose the other road.`); return; }
      this.route = id; this.phase = 'ready';
      this.say(this.pickup ? 'The tunnel road passes the school first. Dispatch when ready.' : `The ${id} road is open. Dispatch when ready.`);
      this.update();
    }

    advance() {
      if (this.held || this.primary.disabled) return;
      const m = this.mission;
      if (this.phase === 'choose') {
        this.phase = 'boarding'; this.say(m.kind === 'cargo' ? 'The bricks are loaded beside the stopped truck.' : 'Everyone climbs aboard while the vehicle is stopped.');
        this.board(this.loads.slice(0, m.count), () => {
          if (m.sea) { this.route = 'sea'; this.phase = 'ready'; this.say('All aboard. The ferry lane is open. Dispatch when ready.'); }
          else { this.phase = 'route'; this.say(m.dest === 'school' ? 'All aboard. Which road goes to the school?' : 'All aboard. Choose an open road.'); }
        });
      } else if (this.phase === 'ready') {
        const path = m.sea ? ['dock', 'sea', 'island'] : m.dest === 'school' ? ROAD.tunnel.slice(0, 5) : this.pickup ? ROAD.tunnel.slice(0, 5) : [...ROAD[this.route], m.dest];
        this.travel(path, Boolean(this.pickup && !this.schoolDone) ? 'school' : m.dest);
      } else if (this.phase === 'checkpoint') {
        this.phase = 'pickup'; this.say('Two more passengers climb aboard at the school.');
        this.board(this.loads.slice(m.count, m.count + this.pickup), () => { this.schoolDone = true; this.phase = 'continue'; this.say(`${this.onboard} passengers aboard. Continue to the station.`); });
      } else if (this.phase === 'continue') {
        this.travel(['school', 'tw', 'te', 'e', m.dest], m.dest, .55);
      } else if (this.phase === 'arrived') {
        this.unload();
      } else if (this.phase === 'done') {
        this.index++;
        if (this.index >= this.missions.length) this.finish(); else this.startMission();
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
      const door = () => ({x: this.pos.x, y: this.pos.y + 1});
      this.run(tl => items.forEach((p, i) => tl.to(p, {x: door().x, y: door().y, a: 0, duration: .45, ease: 'power1.inOut', onUpdate: () => this.paint()}, i * .17)),
        () => { items.forEach(p => { p.a = 0; }); this.onboard += items.length; finish(); });
    }

    travel(points, stop, share = 1) {
      this.phase = 'travelling';
      this.say(stop === 'school' && this.pickup ? 'Driving through town to the school.' : `On the way to the ${PLACE_NAMES[stop].toLowerCase()}.`);
      const end = N[stop];
      this.run(tl => tl.to(this.pos, {duration: SECONDS * share, ease: 'power1.inOut', motionPath: {path: smooth(points), autoRotate: true}, onUpdate: () => this.paint()}),
        () => {
          const [a, b] = [points[points.length - 2], points[points.length - 1]].map(p => typeof p === 'string' ? N[p] : p);
          this.pos = {x: end[0], y: end[1], rotation: Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI};
          if (stop === 'school' && this.pickup && !this.schoolDone) { this.phase = 'checkpoint'; this.say('Stopped beside the school. Collect the two passengers waiting there.'); }
          else { this.phase = 'arrived'; this.say(`Stopped safely at the ${PLACE_NAMES[stop].toLowerCase()}. ${this.mission.unload} when ready.`); }
        });
    }

    unload() {
      const m = this.mission, items = this.loads.filter(p => p.active), [[qx, qy]] = STOPS[m.dest].queue;
      this.phase = 'unloading'; this.say(m.kind === 'cargo' ? 'The bricks are lifted off onto the platform.' : 'Everyone steps off onto the platform.');
      items.forEach(p => { p.x = this.pos.x; p.y = this.pos.y + 1; p.a = 0; });
      const spot = i => ({x: qx + (i % 6) * 2.4, y: qy + Math.floor(i / 6) * 3});
      this.run(tl => items.forEach((p, i) => tl.to(p, {...spot(i), a: 1, duration: .45, ease: 'power1.inOut', onUpdate: () => this.paint()}, i * .13)),
        () => {
          items.forEach((p, i) => Object.assign(p, spot(i), {a: 1}));
          this.onboard = 0; this.phase = 'done'; this.earned++; this.fixes += this.mistakes;
          this.say(m.kind === 'cargo' ? 'Delivery complete. The bricks reached the station.' : m.kind === 'patient' ? 'Delivery complete. The doctors can help now.' : 'Delivery complete. Everyone arrived safely.');
          if (typeof tone === 'function') { tone(523, 0, .12); tone(659, .12, .12); tone(784, .24, .18); }
        });
    }

    finish() {
      this.stopMotion(); this.resize?.disconnect();
      els.round.textContent = 'Round complete';
      const box = el('section', 'dispatch-setup dispatch-done');
      box.append(el('h3', '', 'Dispatch complete'), el('p', 'dispatch-done-score', `${this.earned} ${this.earned === 1 ? 'delivery' : 'deliveries'} made`),
        el('p', '', this.fixes ? `You changed ${this.fixes} ${this.fixes === 1 ? 'choice' : 'choices'} along the way and still got everyone there.` : 'Every vehicle and road was right first time.'));
      const again = el('button', 'dispatch-primary', 'Play again'); again.type = 'button'; again.onclick = () => { if (!this.held) this.startRound(); };
      const change = el('button', 'dispatch-secondary', 'Change settings'); change.type = 'button'; change.onclick = () => { if (!this.held) this.renderSetup(); };
      const row = el('div', 'dispatch-actions'); row.append(again, change); box.append(row);
      this.root.replaceChildren(box);
      if (typeof burstConfetti === 'function') burstConfetti();
    }

    update(wrongId) {
      if (!this.shell?.isConnected) return;
      const m = this.mission, total = m.count + this.pickup;
      this.countEl.textContent = `Delivery ${this.index + 1} of ${this.missions.length} · ${this.earned} done`;
      els.round.textContent = `Delivery ${this.index + 1} of ${this.missions.length}`;
      this.subEl.textContent = this.phase === 'done' ? `${total} delivered` : this.onboard ? `${this.onboard} aboard` : m.kind === 'cargo' ? 'Bricks waiting at the depot' : `${m.count} waiting at the ${PLACE_NAMES[m.start].toLowerCase()}${this.pickup ? ` · ${this.pickup} at the school` : ''}`;
      for (const b of this.choicesEl.children) { b.disabled = this.phase !== 'choose' || this.held; b.setAttribute('aria-pressed', String(b.dataset.vehicle === this.vehicle)); b.classList.toggle('is-wrong', b.dataset.vehicle === wrongId); }
      this.routesEl.hidden = Boolean(m.sea);
      for (const [id, b] of Object.entries(this.routeButtons)) {
        b.textContent = `${id === 'bridge' ? 'Bridge road' : 'Tunnel road'} · ${this.closed === id ? 'closed' : 'open'}`;
        b.disabled = !['route', 'ready'].includes(this.phase) || this.held; b.setAttribute('aria-pressed', String(this.route === id));
      }
      for (const [id, n] of Object.entries(this.closedEl)) n.hidden = this.closed !== id;
      const v = VEHICLES[this.vehicle || m.answer];
      this.actor.textContent = this.vehicle ? v.label.toUpperCase() : '';
      this.actor.hidden = !this.vehicle && this.phase === 'choose';
      this.actor.style.background = v.color;
      const labels = {choose: m.load, boarding: 'Loading…', route: 'Dispatch', ready: 'Dispatch', travelling: 'Travelling…', checkpoint: `Collect ${this.pickup} passengers`, pickup: 'Collecting…', continue: 'Continue to the station', arrived: m.unload, unloading: 'Unloading…', done: this.index + 1 >= this.missions.length ? 'See results' : 'Next delivery'};
      this.primary.textContent = labels[this.phase];
      this.primary.disabled = this.held || this.busy() || this.phase === 'route' || (this.phase === 'choose' && !this.vehicle);
      this.restartBtn.disabled = this.held || this.phase === 'done';
      this.paint();
    }

    paint() {
      if (!this.actor) return;
      const {w, h} = this.size, r = this.pos.rotation * Math.PI / 180;
      let angle = Math.atan2(Math.sin(r) * h, Math.cos(r) * w) * 180 / Math.PI;
      const flip = Math.abs(angle) > 90; // keep the label upright
      this.actor.style.transform = `translate(${w * this.pos.x / 100}px,${h * this.pos.y / 100}px) rotate(${flip ? angle + 180 : angle}deg)`;
      this.actor.classList.toggle('is-reversed', flip);
      for (const p of this.loads) { p.el.hidden = !p.active; p.el.style.opacity = p.a; p.el.style.transform = `translate(${w * p.x / 100}px,${h * p.y / 100}px)`; }
    }

    stopMotion() { this.revision++; this.timeline?.kill(); this.timeline = null; }
    setHeld(held) {
      this.held = held;
      if (held) this.timeline?.pause(); else if (this.media.matches) this.timeline?.progress(1); else this.timeline?.resume();
      if (this.shell?.isConnected && this.mission) this.update();
    }
    destroy() { this.alive = false; this.stopMotion(); this.resize?.disconnect(); }
  }

  globalThis.TransportDispatch = {
    mount(root) { this.destroy(); view = new DispatchView(root); if (globalThis.__dispatchHeld) view.setHeld(true); },
    setHeld(held) { globalThis.__dispatchHeld = held; view?.setHeld(held); },
    destroy() { view?.destroy(); view = null; }
  };
})();
