/* Coastal Station landing: owner-approved painted motion preview, wired into the app.
 * Art, prompts and hashes: artwork/landing/coastal-station-miniature-world/art-ledger.json.
 * Placement (source pixels, 1536 x 1024 camera): images/landing/coastal-station/placement.js,
 * identical to the ledger's "placement" block. Motion reference: that folder's preview.js.
 * One departure per landing visit; re-entry rebuilds the scene from 0 s.
 */
(() => {
  const ART = 'images/landing/coastal-station/';
  const NS = 'http://www.w3.org/2000/svg';
  const DURATION = 19;
  const ASSETS = ['sky-backplate', 'distant-coast', 'runway-plane', 'station-stage', 'harbour-ferry', 'station-train',
    'station-bus', 'ferry-door-closed', 'bus-door-closed', 'kerb-stop', 'ferry-gangway', 'exit-trees',
    ...['boarding-passenger', 'boarding-passenger-2'].flatMap(cast => [0, 1, 2, 3].map(frame => cast + '-' + frame))];

  class TransportLanding {
    constructor(root) {
      this.root = root;
      this.place = window.COASTAL_STATION;
      this.active = false;
      this.ready = false;
      this.destroyed = false;
      this.holds = new Set();
      this.preference = matchMedia('(prefers-reduced-motion: reduce)');
      this.reducedOverride = false;
      this.root.classList.add('transport-world');
      this.root.replaceChildren();
      this.build();
      this.onVisibility = () => this.setHold('hidden', document.hidden);
      this.onPreference = () => this.sync();
      this.onPageHide = event => event.persisted ? this.setHold('page', true) : this.destroy();
      this.onPageShow = () => this.setHold('page', false);
      document.addEventListener('visibilitychange', this.onVisibility);
      this.preference.addEventListener('change', this.onPreference);
      window.addEventListener('pagehide', this.onPageHide);
      window.addEventListener('pageshow', this.onPageShow);
      this.observer = new ResizeObserver(() => this.layout());
      this.observer.observe(root);
      this.onVisibility();
      this.layout();
      // Load events, not decode(): decode() of detached images can stall in throttled or background views.
      Promise.allSettled(ASSETS.map(name => new Promise((resolve, reject) => {
        const probe = new Image();
        probe.onload = () => probe.naturalWidth ? resolve() : reject(new Error(name));
        probe.onerror = () => reject(new Error(name));
        probe.src = ART + name + '.png';
      }))).then(results => {
        if (this.destroyed) return;
        this.ready = results.every(result => result.status === 'fulfilled');
        this.root.dataset.ready = this.ready ? 'true' : 'error';
        this.sync();
      });
    }

    get reduced() { return this.reducedOverride || this.preference.matches; }

    node(tag, attributes, parent = this.svg) {
      const element = document.createElementNS(NS, tag);
      for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
      parent.append(element);
      return element;
    }

    image(name, box, parent = this.svg) {
      return this.node('image', { href: ART + name + '.png', x: box[0], y: box[1], width: box[2], height: box[3], preserveAspectRatio: 'none' }, parent);
    }

    vehicle(name, placement) {
      const { art } = this.place;
      const anchor = this.node('g', { transform: `translate(${placement.x} ${placement.y})` });
      const motion = this.node('g', { 'data-actor': name }, anchor);
      this.image(name, [0, 0, placement.w, placement.w * art[name].height / art[name].width], motion);
      return motion;
    }

    // Layers follow the ledger's planeOrder; door panels ride inside their vehicle groups.
    build() {
      const { W, H, art, bus, train, ferry, plane, occluder, people, gangway } = this.place;
      this.svg = this.node('svg', { class: 'transport-camera', viewBox: `0 0 ${W} ${H}`, 'aria-hidden': 'true', focusable: 'false' }, this.root);
      this.image('sky-backplate', [0, 0, W, H]);
      const defs = this.node('defs', {});
      const fade = this.node('linearGradient', { id: 'coastal-sky-fade', gradientUnits: 'userSpaceOnUse', x1: 0, x2: 0, y1: 115, y2: 335 }, defs);
      this.node('stop', { offset: 0, 'stop-color': 'black' }, fade);
      this.node('stop', { offset: 1, 'stop-color': 'white' }, fade);
      const mask = this.node('mask', { id: 'coastal-distant-mask', maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: W, height: H }, defs);
      this.node('rect', { x: 0, y: 0, width: W, height: H, fill: 'url(#coastal-sky-fade)' }, mask);
      this.image('distant-coast', [0, 0, W, H]).setAttribute('mask', 'url(#coastal-distant-mask)');
      this.plane = this.vehicle('runway-plane', plane);
      this.image('station-stage', [0, 0, W, H]);
      this.ferry = this.vehicle('harbour-ferry', ferry);
      this.train = this.vehicle('station-train', train);
      this.bus = this.vehicle('station-bus', bus);
      this.ferryDoor = this.image('ferry-door-closed', ferry.door, this.ferry);
      this.busDoor = this.image('bus-door-closed', bus.door, this.bus);
      this.image('kerb-stop', bus.shelter);
      this.ramp = this.node('g', { 'data-actor': 'gangway', visibility: 'hidden' });
      this.image('ferry-gangway', gangway.box, this.ramp);
      this.people = people.map((spec, index) => {
        const anchor = this.node('g', { transform: `translate(${spec.start[0]} ${spec.start[1]})`, 'data-queue': spec.queue });
        const move = this.node('g', { 'data-passenger': index }, anchor);
        const frames = [0, 1, 2, 3].map(frame => {
          const id = spec.cast + '-' + frame;
          const w = spec.h * art[id].width / art[id].height;
          const source = this.image(id, [-w / 2, -spec.h, w, spec.h], move);
          if (spec.face === -1) source.setAttribute('transform', 'scale(-1 1)');
          if (spec.tint) source.style.filter = `hue-rotate(${spec.tint}deg)`;
          source.setAttribute('visibility', frame ? 'hidden' : 'visible');
          return source;
        });
        return { spec, move, frames, activeFrame: 0 };
      });
      this.image('exit-trees', occluder.box);
    }

    layout() {
      if (this.destroyed) return;
      const { width, height } = this.root.getBoundingClientRect();
      if (!width || !height) return;
      const { W, H, cameraX } = this.place;
      let box;
      if (width / height <= W / H) {
        // Phones and narrow windows: full height, cropped around the station square.
        const crop = H * width / height;
        box = [Math.min(W - crop, Math.max(0, cameraX - crop / 2)), 0, crop, H];
        this.root.dataset.camera = 'square';
      } else {
        // Wide screens: full width. Most of the cut comes from the sky; up to 48 px of the front
        // flower bed goes too, so the quay sits below the title and Explore (feet stop at y=961).
        const crop = W * height / width;
        const cut = H - crop;
        box = [0, cut - Math.min(48, cut * .3), W, crop];
        this.root.dataset.camera = 'wide';
      }
      this.svg.setAttribute('viewBox', box.map(value => Math.round(value * 100) / 100).join(' '));
      // Only the camera changes; resizing never restarts or skips the timeline.
    }

    setActive(value) { this.active = Boolean(value); this.sync(); }
    setReduced(value) { this.reducedOverride = Boolean(value); this.sync(); }
    setHold(reason, value) {
      if (value) this.holds.add(reason); else this.holds.delete(reason);
      this.sync();
    }

    frameAt(actor, index) {
      if (actor.activeFrame === index) return;
      actor.frames[actor.activeFrame].setAttribute('visibility', 'hidden');
      actor.frames[index].setAttribute('visibility', 'visible');
      actor.activeFrame = index;
    }

    createMotion() {
      const { gsap, MotionPathPlugin } = window;
      if (!gsap || !MotionPathPlugin) return;
      gsap.registerPlugin(MotionPathPlugin);
      const { bus, train, ferry, plane } = this.place;
      this.context = gsap.context(() => {
        const timeline = this.timeline = gsap.timeline({ paused: true, onUpdate: () => this.step() });
        gsap.set(this.train, { x: train.arrival });
        gsap.set(this.ferry, { x: ferry.arrival });
        gsap.set(this.plane, { x: plane.startX, y: plane.startY });
        gsap.set(this.ramp, { autoAlpha: 0 });

        // Train: the left engine leads in from the right and stops at 4.25 s; from 13 s the right
        // engine leads out to the right. All four units are one image, so orientation and coupler
        // spacing never change.
        timeline
          .to(this.train, { x: 0, duration: 3.9, ease: 'power2.out' }, .35)
          .to(this.train, { x: train.arrival, duration: 6, ease: 'power1.in' }, 13)
          // Ferry: berthed by 5.8 s, gangway out, two board, gangway in and door shut, away left at 12.35 s.
          .to(this.ferry, { x: 0, duration: 4.45, ease: 'power2.out' }, 1.35)
          .to(this.ferryDoor, { autoAlpha: 0, duration: .3 }, 5.8)
          .to(this.ramp, { autoAlpha: 1, duration: .35 }, 5.9)
          .to(this.ramp, { autoAlpha: 0, duration: .3 }, 12)
          .to(this.ferryDoor, { autoAlpha: 1, duration: .25 }, 12.05)
          .to(this.ferry, { x: ferry.exit, duration: 5.65, ease: 'power1.in' }, 12.35)
          // Bus: door opens, three board at the front threshold, door shuts, leaves right at 8.65 s.
          .to(this.busDoor, { autoAlpha: 0, duration: .3 }, 4.15)
          .to(this.busDoor, { autoAlpha: 1, duration: .34 }, 8.02)
          .to(this.bus, { x: bus.exit, duration: 5.25, ease: 'power1.in' }, 8.65)
          // Plane: far-left runway. Curved approach, straight ground roll, curved climb (normalized paths).
          .to(this.plane, { motionPath: { path: [{ x: plane.startX, y: plane.startY }, { x: plane.startX * .5, y: plane.startY * .5 }, { x: plane.touchX, y: 0 }] }, duration: 2.9, ease: 'power1.out' }, .1)
          .to(this.plane, { x: 0, duration: 1.5, ease: 'power1.out' }, 3)
          .to(this.plane, { x: plane.liftX, duration: 1.8, ease: 'power1.in' }, 14.4)
          .to(this.plane, { motionPath: { path: [{ x: plane.liftX, y: 0 }, { x: plane.exitX * .42, y: plane.exitY * .15 }, { x: plane.exitX, y: plane.exitY }] }, duration: 2.7, ease: 'power1.in' }, 16.2);

        // Passengers walk straight segments (curviness 0) and fade at the door.
        for (const { spec, move } of this.people) {
          const along = spec.path.map(([x, y]) => ({ x: x - spec.start[0], y: y - spec.start[1] }));
          timeline.to(move, { motionPath: { path: along, curviness: 0 }, duration: spec.walk, ease: 'none' }, spec.at);
          timeline.to(move, { autoAlpha: 0, duration: .14 }, spec.at + spec.walk - .05);
        }
        timeline.set({}, {}, DURATION);
      }, this.root);
      this.step();
    }

    step() {
      const time = this.timeline ? this.timeline.time() : 0;
      for (const actor of this.people) {
        const elapsed = time - actor.spec.at;
        this.frameAt(actor, elapsed > 0 && elapsed < actor.spec.walk ? [1, 2, 3, 2][Math.floor(elapsed * 7) % 4] : 0);
      }
      this.root.dataset.time = time.toFixed(2);
    }

    clearMotion() {
      this.context?.revert();
      this.context = this.timeline = null;
      for (const actor of this.people) this.frameAt(actor, 0);
      this.root.dataset.time = '0.00';
    }

    sync() {
      if (this.destroyed) return;
      this.root.dataset.reduced = String(this.reduced);
      this.root.dataset.active = String(this.active);
      this.root.dataset.held = String(this.holds.size > 0);
      if (!this.active || this.reduced) {
        // Off the landing, or reduced motion: the stationary docked frame.
        this.clearMotion();
        this.root.dataset.motion = this.reduced ? 'reduced' : 'rest';
        return;
      }
      if (this.ready && !this.timeline) this.createMotion();
      this.timeline?.paused(this.holds.size > 0);
      this.root.dataset.motion = !this.ready ? 'loading' : this.holds.size ? 'held' : this.timeline ? 'running' : 'rest';
    }

    destroy() {
      if (this.destroyed) return;
      this.clearMotion();
      this.observer.disconnect();
      document.removeEventListener('visibilitychange', this.onVisibility);
      this.preference.removeEventListener('change', this.onPreference);
      window.removeEventListener('pagehide', this.onPageHide);
      window.removeEventListener('pageshow', this.onPageShow);
      this.destroyed = true;
    }
  }
  window.TransportLanding = TransportLanding;
})();
