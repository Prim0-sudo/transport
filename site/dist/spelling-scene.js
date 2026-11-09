// Departure Signal: the Transport spelling scene.
// Art: artwork/spelling/departure-signal-v2 (coastal set, registration.json). Movement: art-concepts/spelling-scene/preview.
// Rules follow Plants blueprint v6.0 (theme spelling, ART-AND-ANIMATION): the scene only shows the round's
// state. Spelling fairness, input and scoring stay in app.js; a late scene callback never touches a later round.
(() => {
  const ART = 'images/spelling/departure-signal-v2/';
  const W = 1536, H = 1024;
  const TRAIN = {canvas: [1315, 379], origin: [200, 508.33], width: 1106,
    wheels: [78.2, 187.2, 423.2, 529.7, 702.2, 810.8, 1046, 1155.5], wheelY: 333, wheelSprite: 86.18, wheelDiameter: 68,
    // Exhaust: the engine roof vent (registration.json) and the rear end, so it reads as a broken-down diesel, not steam.
    smoke: [[1127, 13], [40, 36]], offscreen: [-1110, 1540]};
  const LAMPS = {centers: [[294, 218], [406, 216], [517, 216], [628, 214], [740, 214], [851, 212], [963, 212], [1074, 210]],
    lens: 52, spriteCenter: [256, 286], spriteRadius: 142};
  const pct = (n, of) => `${n / of * 100}%`;
  const s = TRAIN.width / TRAIN.canvas[0];
  // Scene units travelled per degree of wheel turn, from the visible wheel radius on the scene canvas.
  const UNITS_PER_DEGREE = TRAIN.wheelDiameter / 2 * s * Math.PI / 180;

  class TransportSpellingScene {
    constructor(slot, round, {held = false} = {}) {
      this.round = round; this.held = held; this.alive = true;
      this.misses = Math.min(8, round.misses || 0);
      this.outcome = round.terminal || 'active';
      this.media = matchMedia('(prefers-reduced-motion: reduce)');
      this.pos = {x: 0}; // actor offset on the scene canvas, in canvas units
      const scene = this.scene = document.createElement('div');
      scene.className = 'departure-scene';
      const plane = (name, extra = '') => `<img class="ds-plane${extra}" src="${ART}${name}.webp" alt="" draggable="false">`;
      const [tw, th] = TRAIN.canvas, d = TRAIN.wheelSprite;
      scene.innerHTML = `${plane('layer-1-sky')}${plane('layer-2-background')}${plane('layer-3-track-and-gantry')}
        <div class="ds-train" style="left:${pct(TRAIN.origin[0], W)};top:${pct(TRAIN.origin[1], H)};width:${pct(TRAIN.width, W)};aspect-ratio:${tw}/${th}">
          ${TRAIN.wheels.map(cx => `<img class="ds-wheel" src="${ART}wheel.webp" alt="" draggable="false" style="left:${pct(cx - d / 2, tw)};top:${pct(TRAIN.wheelY - d / 2, th)};width:${pct(d, tw)}">`).join('')}
          <img class="ds-body" src="${ART}train-body.webp" alt="" draggable="false">
          ${TRAIN.smoke.map(([x, y]) => `<div class="ds-smoke" style="left:${pct(x, tw)};top:${pct(y, th)}"></div>`).join('')}
        </div>
        ${LAMPS.centers.map(([cx, cy]) => { const {lens, spriteRadius: r, spriteCenter: [lx, ly]} = LAMPS, lens2 = img => `<img class="ds-${img}" src="${ART}lamp-${img}.webp" alt="" draggable="false" style="width:${pct(512, 2 * r)};left:${pct(r - lx, 2 * r)};top:${pct(r - ly, 2 * r)}">`;
          return `<span class="ds-lens" style="left:${pct(cx - lens / 2, W)};top:${pct(cy - lens / 2, H)};width:${pct(lens, W)}">${lens2('green')}${lens2('red')}</span>`; }).join('')}
        ${plane('layer-4-foreground', ' ds-fore')}`;
      scene.setAttribute('aria-hidden', 'true');
      slot.append(scene);
      this.train = scene.querySelector('.ds-train');
      this.wheels = [...scene.querySelectorAll('.ds-wheel')];
      this.smokes = [...scene.querySelectorAll('.ds-smoke')];
      this.lamps = [...scene.querySelectorAll('.ds-lens')].map(el => ({green: el.querySelector('.ds-green'), red: el.querySelector('.ds-red')}));
      this.ctx = gsap.context(() => {}, scene);
      this.onMotion = () => { if (this.media.matches) this.settle(); };
      this.media.addEventListener('change', this.onMotion);
      this.start();
    }

    // Actor position: the parent moves, wheels turn in proportion to the distance travelled.
    // Quick setters: per-frame writes create no tweens, so nothing piles up in the scene's context.
    paint() {
      this.setX ||= gsap.quickSetter(this.train, 'xPercent');
      this.setTurn ||= this.wheels.map(w => gsap.quickSetter(w, 'rotation', 'deg'));
      this.setX(this.pos.x / TRAIN.width * 100);
      const turn = this.pos.x / UNITS_PER_DEGREE;
      for (const set of this.setTurn) set(turn);
    }
    move(vars) { return gsap.to(this.pos, {...vars, onUpdate: () => this.paint()}); }
    reduced() { return this.media.matches; }
    // Every animation goes through here so hold, reduced motion and teardown reach it.
    add(build) { this.ctx.add(() => { const made = build(); if (this.held) [].concat(made || []).forEach(a => a?.pause?.()); }); }
    setLamp(i, red) { const l = this.lamps[i]; gsap.set(l.red, {opacity: red ? 1 : 0, scale: 1}); gsap.set(l.green, {opacity: red ? 0 : 1, scale: 1}); }

    start() {
      this.lamps.forEach((_, i) => this.setLamp(i, this.outcome === 'lost' || (this.outcome !== 'won' && i < this.misses)));
      if (this.outcome === 'won') { this.pos.x = TRAIN.offscreen[1]; this.paint(); return; }
      if (this.outcome === 'lost') { this.pos.x = 0; this.paint(); this.breakdown(true); return; }
      if (this.reduced()) { this.pos.x = 0; this.paint(); return; }
      // A train rolls in from the left and brakes at the platform.
      this.pos.x = TRAIN.offscreen[0]; this.paint();
      this.add(() => this.move({x: 0, duration: 1.8, ease: 'power3.out'}));
    }

    update(round) {
      if (!this.alive || round !== this.round) return;
      const misses = Math.min(8, round.misses || 0), outcome = round.terminal || 'active';
      for (let i = this.misses; i < misses; i++) this.miss(i);
      this.misses = misses;
      if (outcome !== this.outcome) { this.outcome = outcome; outcome === 'won' ? this.win() : this.breakdown(false); }
    }

    miss(i) {
      const l = this.lamps[i];
      if (this.reduced()) { this.setLamp(i, true); return; }
      this.add(() => gsap.timeline()
        .to(l.green, {scale: .6, opacity: 0, duration: .18, ease: 'power2.in'})
        .fromTo(l.red, {scale: .5, opacity: 0}, {scale: 1, opacity: 1, duration: .35, ease: 'back.out(3)'}, '<.1')
        // the train gives a small impatient shudder on its rails
        .fromTo(this.train, {x: 0}, {x: '0.35%', duration: .06, repeat: 5, yoyo: true, ease: 'sine.inOut'}, '<'));
    }

    win() {
      if (this.reduced()) { this.lamps.forEach((_, i) => this.setLamp(i, false)); this.pos.x = TRAIN.offscreen[1]; this.paint(); return; }
      this.ctx.getTweens().forEach(t => { if (t.targets?.().includes(this.pos)) t.kill(); });
      this.add(() => {
        const tl = gsap.timeline();
        // green wave left to right, then the train pulls away and leaves the frame
        this.lamps.forEach((l, i) => tl.to(l.red, {opacity: 0, duration: .15}, i * .08).fromTo(l.green, {scale: .6, opacity: gsap.getProperty(l.green, 'opacity')}, {scale: 1, opacity: 1, duration: .3, ease: 'back.out(3)'}, i * .08));
        tl.to(this.pos, {x: 66, duration: .5, ease: 'power1.in', onUpdate: () => this.paint()}, '+=.25')
          .to(this.pos, {x: TRAIN.offscreen[1], duration: 1.6, ease: 'power2.in', onUpdate: () => this.paint()});
        return tl;
      });
    }

    // Eight distinct wrong guesses: every lamp red, the train dims and smokes at the platform.
    breakdown(stable) {
      this.lamps.forEach((_, i) => this.setLamp(i, true));
      if (stable || this.reduced()) { gsap.set(this.train, {filter: 'brightness(.82) saturate(.8)'}); this.puffs(true); return; }
      this.add(() => gsap.timeline({delay: .4})
        .to(this.lamps.map(l => l.red), {scale: 1.15, duration: .25, yoyo: true, repeat: 1, ease: 'sine.inOut'})
        .fromTo(this.train, {y: 0}, {y: '-1.2%', duration: .07, repeat: 5, yoyo: true, ease: 'sine.inOut'}, '<')
        .to(this.train, {filter: 'brightness(.82) saturate(.8)', duration: .6}, '<.3')
        .add(() => this.puffs(false), '<.1'));
    }

    // Smoke sits in front of the gantry but stays low and trails back along the roof, so it never covers a lamp.
    puffs(still) {
      const make = (emitter, i) => { const img = document.createElement('img'); img.src = `${ART}smoke-${i % 3 + 1}.webp`; img.alt = ''; img.className = 'ds-puff'; this.smokes[emitter].append(img); return img; };
      this.smokes.forEach(s => s.replaceChildren());
      if (still || this.reduced()) {
        // one still plume per vent says the same thing without movement
        [[0, 0, -10, -40, .75], [0, 1, -70, -78, .95], [0, 2, -140, -100, 1.1], [1, 0, -15, -35, .7], [1, 1, -70, -70, .9]]
          .forEach(([e, i, x, y, sc]) => gsap.set(make(e, i), {xPercent: x, yPercent: y, scale: sc, opacity: .92}));
        return;
      }
      // nine puffs from the engine vent, five smaller ones from the rear
      for (let n = 0; n < 14; n++) {
        const rear = n >= 9, i = rear ? n - 9 : n, p = make(rear ? 1 : 0, i);
        const drift = rear ? gsap.utils.random(-170, -110) : gsap.utils.random(-260, -160), lift = rear ? gsap.utils.random(-95, -65) : gsap.utils.random(-110, -75);
        this.add(() => gsap.timeline({repeat: -1, delay: i * (rear ? .55 : .34) + (rear ? .2 : 0)})
          .fromTo(p, {xPercent: 0, yPercent: 0, scale: .25, opacity: 0, rotation: gsap.utils.random(-20, 20)},
            {xPercent: drift, yPercent: lift, scale: rear ? gsap.utils.random(.9, 1.2) : gsap.utils.random(1, 1.4), rotation: '+=30', duration: 2.9, ease: 'sine.out'})
          .to(p, {opacity: .95, duration: .35, ease: 'power1.out'}, 0)
          .to(p, {opacity: 0, duration: 1.2, ease: 'power1.in'}, 1.7));
      }
    }

    // Reduced motion switched on mid-move: jump to the stable pose for the current state.
    settle() {
      if (!this.alive) return;
      this.ctx.revert(); this.ctx = gsap.context(() => {}, this.scene);
      gsap.set(this.train, {clearProps: 'filter,x,y'});
      this.smokes.forEach(s => s.replaceChildren());
      this.start();
    }

    setHeld(held) {
      this.held = held;
      for (const a of this.ctx.getTweens()) held ? a.pause() : a.resume();
    }

    destroy() {
      if (!this.alive) return;
      this.alive = false;
      this.media.removeEventListener('change', this.onMotion);
      this.ctx.revert();
      this.scene.remove();
    }
  }

  globalThis.TransportSpellingScene = TransportSpellingScene;
})();
