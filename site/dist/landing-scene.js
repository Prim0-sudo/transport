/* Approved Miniature World artwork; source coordinates remain fixed under one camera.
 * Reference: Plants core/landing-scene.js and blueprint-v6.0/ART-AND-ANIMATION.md.
 */
(() => {
  const ART = '/images/landing/miniature-world-v1/';
  const W = 1672, H = 941;
  class TransportLanding {
    constructor(root) {
      this.root = root;
      this.active = false;
      this.ready = false;
      this.destroyed = false;
      this.holds = new Set();
      this.preference = matchMedia('(prefers-reduced-motion: reduce)');
      this.reducedOverride = false;
      this.root.classList.add('transport-world');
      this.root.innerHTML = `
        <img class="transport-sky" src="${ART}sky.png" alt="">
        <div class="transport-camera">
          <div class="transport-cloud cloud-one"><img src="${ART}cloud.png" alt=""></div>
          <div class="transport-cloud cloud-two"><img src="${ART}cloud.png" alt=""></div>
          <img class="transport-plane distant-plane" src="${ART}distant-background.png" alt="">
          <div class="transport-actor plane-actor" data-actor="airplane"><img src="${ART}airplane.png" alt=""></div>
          <img class="transport-plane airfield-cover" src="${ART}distant-background.png" alt="">
          <img class="transport-plane town-plane" src="${ART}middle-ground.png" alt="">
          <div class="transport-actor bus-actor" data-actor="bus"><img src="${ART}bus.png" alt=""></div>
          <div class="transport-actor train-actor" data-actor="train"><img src="${ART}train-front.png" alt=""></div>
          <div class="transport-actor ferry-actor" data-actor="ferry"><img src="${ART}ferry.png" alt=""></div>
          <img class="transport-plane depot-cover" src="${ART}middle-ground.png" alt="">
          <img class="transport-plane foreground-plane" src="${ART}foreground.png" alt="">
        </div>`;
      this.camera = root.querySelector('.transport-camera');
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
      const images = [...root.querySelectorAll('img')];
      Promise.allSettled(images.map(image => image.decode())).then(() => {
        if (this.destroyed) return;
        this.ready = images.every(image => image.complete && image.naturalWidth);
        this.root.dataset.ready = this.ready ? 'true' : 'error';
        this.sync();
      });
    }

    get reduced() { return this.reducedOverride || this.preference.matches; }

    layout() {
      if (this.destroyed) return;
      const { width, height } = this.root.getBoundingClientRect();
      if (!width || !height) return;
      // Portrait phones retain the entire town, with the real sky continuing above it.
      const portrait = width <= 600 && height > width;
      const scale = portrait ? width / W : Math.max(width / W, height / H);
      const x = (width - W * scale) / 2;
      const y = portrait ? height - H * scale : (height - H * scale) / 2;
      this.camera.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      this.root.dataset.camera = portrait ? 'whole-town' : 'cover';
      // The same source paths scale with the scenery; resize never restarts a journey.
    }

    setActive(value) { this.active = Boolean(value); this.sync(); }
    setReduced(value) { this.reducedOverride = Boolean(value); this.sync(); }
    setHold(reason, value) {
      if (value) this.holds.add(reason); else this.holds.delete(reason);
      this.sync();
    }

    createMotion() {
      const { gsap, MotionPathPlugin } = window;
      if (!gsap || !MotionPathPlugin) return;
      gsap.registerPlugin(MotionPathPlugin);
      this.context = gsap.context(() => {
        const master = this.timeline = gsap.timeline({ paused: true });
        const bus = this.root.querySelector('.bus-actor');
        const train = this.root.querySelector('.train-actor');
        const ferry = this.root.querySelector('.ferry-actor');
        const plane = this.root.querySelector('.plane-actor');
        const path = points => ({ path: points.map(([x, y]) => ({ x, y })), curviness: .5, autoRotate: false });
        const dwell = (timeline, duration) => timeline.to({}, { duration });

        // A bounded depot-bay manoeuvre keeps both tyre contacts on asphalt.
        const busTrip = gsap.timeline({ repeat: -1 });
        dwell(busTrip, 7);
        busTrip.to(bus, { motionPath: path([[0, 0], [24, 5], [54, 13]]), duration: 7, ease: 'sine.inOut' });
        dwell(busTrip, 3);
        busTrip.to(bus, { motionPath: path([[54, 13], [24, 5], [0, 0]]), duration: 7, ease: 'sine.inOut' });
        dwell(busTrip, 9);
        master.add(busTrip, 0);

        // Railcars reverse at a station. No flat-image rotation or fake full-track loop.
        const railTrip = gsap.timeline({ repeat: -1 });
        dwell(railTrip, 12);
        railTrip.to(train, { motionPath: path([[0, 0], [-17, -20], [-35, -39]]), duration: 9, ease: 'sine.inOut' });
        dwell(railTrip, 5);
        railTrip.to(train, { motionPath: path([[-35, -39], [-17, -20], [0, 0]]), duration: 9, ease: 'sine.inOut' });
        dwell(railTrip, 8);
        master.add(railTrip, 0);

        // Gentle berth movement stays wholly within the harbour's water envelope.
        const berth = gsap.timeline({ repeat: -1 });
        dwell(berth, 4);
        berth.to(ferry, { motionPath: path([[0, 0], [-20, 3], [-38, 6]]), duration: 12, ease: 'sine.inOut' });
        dwell(berth, 4);
        berth.to(ferry, { motionPath: path([[-38, 6], [-20, 3], [0, 0]]), duration: 12, ease: 'sine.inOut' });
        dwell(berth, 6);
        master.add(berth, 0);

        // Fixed-gear aircraft: taxi, climb clear of the title, cross the upper sky,
        // exit fully, then re-enter along the runway from beyond the right edge.
        const flight = gsap.timeline({ repeat: -1 });
        dwell(flight, 16);
        flight.to(plane, {
          motionPath: path([[0, 0], [-90, -7], [-180, -24], [-245, -95], [-310, -210], [-420, -260], [-800, -270], [-1550, -280]]),
          duration: 25, ease: 'none',
        });
        flight.set(plane, { x: 550, y: 35 });
        flight.to(plane, { motionPath: path([[550, 35], [340, 25], [170, 12], [0, 0]]), duration: 11, ease: 'power1.out' });
        master.add(flight, 0);

        for (const [index, cloud] of [...this.root.querySelectorAll('.transport-cloud')].entries()) {
          const start = index ? 1110 : 180;
          const clouds = gsap.timeline();
          clouds.set(cloud, { x: start });
          clouds.to(cloud, { x: 1920, duration: (1920 - start) / (index ? 22 : 27), ease: 'none' });
          clouds.set(cloud, { x: -400 });
          clouds.to(cloud, { x: 1920, duration: index ? 105 : 86, repeat: -1, ease: 'none' });
          master.add(clouds, 0);
        }
      }, this.root);
    }

    clearMotion() {
      this.context?.revert();
      this.context = this.timeline = null;
    }

    sync() {
      if (this.destroyed) return;
      this.root.dataset.reduced = String(this.reduced);
      this.root.dataset.active = String(this.active);
      this.root.dataset.held = String(this.holds.size > 0);
      if (!this.active || this.reduced) {
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
