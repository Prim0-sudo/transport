const { W, H, cameraX, art, bus, train, ferry, plane, occluder, people, gangway, stationRoofOcclusion } = window.COASTAL_STATION;
const world = document.getElementById('world');
const root = document.querySelector('main');
const camera = document.getElementById('camera');
const play = document.getElementById('play');
const reset = document.getElementById('reset');
const seek = document.getElementById('seek');
const seconds = document.getElementById('seconds');
const phase = document.getElementById('phase');
const moments = [...document.querySelectorAll('[data-moment]')];
const svgNS = 'http://www.w3.org/2000/svg';
const duration = 19;
const stops = { bus: 4.4, ferry: 9, train: 13 };
const cues = [
  [0, 'The bus is waiting. The ferry and train approach.'],
  [4.25, 'The train stops at the platform. The bus starts boarding.'],
  [5.8, 'The ferry is secured at the quay and lowers its gangway.'],
  [8.65, 'Three passengers are aboard the bus. It pulls away.'],
  [9, 'Two passengers walk from the quay onto the ferry.'],
  [12.35, 'The gangway is raised. The ferry gets under way.'],
  [13, 'The engine at the other end leads the train back out.'],
  [19, 'All departures complete.'],
];

function node(tag, attributes, parent = world) {
  const result = document.createElementNS(svgNS, tag);
  for (const [key, value] of Object.entries(attributes)) result.setAttribute(key, value);
  parent.append(result);
  return result;
}

function image(name, box, parent = world) {
  return node('image', {
    href: 'art/' + name + '.png', x: box[0], y: box[1],
    width: box[2], height: box[3], preserveAspectRatio: 'none',
  }, parent);
}

function vehicle(name, placement) {
  const parent = node('g', { transform: 'translate(' + placement.x + ' ' + placement.y + ')' });
  const motion = node('g', { 'data-vehicle': name }, parent);
  const w = placement.w;
  image(name, [0, 0, w, w * art[name].height / art[name].width], motion);
  return motion;
}

image('sky-backplate', [0, 0, W, H]);
const defs = node('defs', {});
const skyFade = node('linearGradient', { id: 'sky-fade', gradientUnits: 'userSpaceOnUse', x1: 0, x2: 0, y1: 115, y2: 335 }, defs);
node('stop', { offset: 0, 'stop-color': 'black' }, skyFade);
node('stop', { offset: 1, 'stop-color': 'white' }, skyFade);
const distantMask = node('mask', { id: 'distant-mask', maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: W, height: H }, defs);
node('rect', { x: 0, y: 0, width: W, height: H, fill: 'url(#sky-fade)' }, distantMask);
const coast = image('distant-coast', [0, 0, W, H]);
coast.setAttribute('mask', 'url(#distant-mask)');
const runwayPlane = vehicle('runway-plane', plane);
image('station-stage', [0, 0, W, H]);
const ferryActor = vehicle('harbour-ferry', ferry);
const roof = node('clipPath', { id: 'station-roof' }, defs);
node('path', { d: stationRoofOcclusion }, roof);
image('station-stage', [0, 0, W, H]).setAttribute('clip-path', 'url(#station-roof)');
const trainActor = vehicle('station-train', train);
const busActor = vehicle('station-bus', bus);
const ferryDoor = image('ferry-door-closed', ferry.door, ferryActor);
const busDoor = image('bus-door-closed', bus.door, busActor);
image('kerb-stop', bus.shelter);
const ramp = node('g', { id: 'gangway' });
image('ferry-gangway', gangway.box, ramp);

function passenger(spec, index) {
  const placement = node('g', {
    transform: 'translate(' + spec.start[0] + ' ' + spec.start[1] + ')',
    'data-queue': spec.queue,
  });
  const move = node('g', { 'data-passenger': index }, placement);
  const frames = [0, 1, 2, 3].map((frame) => {
    const id = spec.cast + '-' + frame;
    const h = spec.h;
    const w = h * art[id].width / art[id].height;
    const source = image(id, [-w / 2, -h, w, h], move);
    if (spec.face === -1) source.setAttribute('transform', 'scale(-1 1)');
    if (spec.tint) source.style.filter = 'hue-rotate(' + spec.tint + 'deg)';
    source.setAttribute('visibility', frame === 0 ? 'visible' : 'hidden');
    return source;
  });
  return { spec, move, frames, activeFrame: 0 };
}

const passengers = people.map(passenger);
image('exit-trees', occluder.box);

function fitCamera() {
  const { width, height } = world.getBoundingClientRect();
  if (!height || !width) return;
  const crop = Math.min(W, H * width / height);
  const left = Math.min(W - crop, Math.max(0, cameraX - crop / 2));
  world.setAttribute('viewBox', [left, 0, crop, H].join(' '));
}

const observer = new ResizeObserver(fitCamera);
observer.observe(world);
fitCamera();
camera.addEventListener('click', () => {
  const phone = root.classList.toggle('phone');
  camera.setAttribute('aria-pressed', String(phone));
  camera.textContent = phone ? 'Wider framing' : 'Phone framing';
  fitCamera();
});

function frameAt(actor, index) {
  if (actor.activeFrame === index) return;
  actor.frames[actor.activeFrame].setAttribute('visibility', 'hidden');
  actor.frames[index].setAttribute('visibility', 'visible');
  actor.activeFrame = index;
}

seek.max = duration;
gsap.registerPlugin(MotionPathPlugin);
const media = gsap.matchMedia();
media.add({
  motion: '(prefers-reduced-motion: no-preference)',
  still: '(prefers-reduced-motion: reduce)',
}, ({ conditions }) => {
  const isStill = conditions.still;
  const controls = [play, reset, seek, ...moments];
  for (const control of controls) control.disabled = isStill;
  if (isStill) {
    phase.textContent = 'Reduced motion. The vehicles are shown at rest.';
    seek.value = 0;
    seconds.textContent = '0.0 s';
    gsap.set(ramp, { autoAlpha: 0 });
    return;
  }

  const controller = new AbortController();
  const options = { signal: controller.signal };
  gsap.set(trainActor, { x: train.arrival });
  gsap.set(ferryActor, { x: ferry.arrival });
  gsap.set(runwayPlane, { x: plane.startX, y: plane.startY });
  gsap.set(ramp, { autoAlpha: 0 });
  const timeline = gsap.timeline({ paused: true, onUpdate: update, onComplete: update });

  timeline
    .addLabel('Train arrives', .35)
    .to(trainActor, { x: 0, duration: 3.9, ease: 'power2.out' }, 'Train arrives')
    .addLabel('Train reverses out', 13)
    .to(trainActor, { x: train.arrival, duration: 6, ease: 'power1.in' }, 'Train reverses out')
    .addLabel('Ferry arrives', 1.35)
    .to(ferryActor, { x: 0, duration: 4.45, ease: 'power2.out' }, 'Ferry arrives')
    .to(ferryDoor, { autoAlpha: 0, duration: .3 }, 5.8)
    .to(ramp, { autoAlpha: 1, duration: .35 }, 5.9)
    .to(ramp, { autoAlpha: 0, duration: .3 }, 12)
    .to(ferryDoor, { autoAlpha: 1, duration: .25 }, 12.05)
    .addLabel('Ferry leaves', 12.35)
    .to(ferryActor, { x: ferry.exit, duration: 5.65, ease: 'power1.in' }, 'Ferry leaves')
    .to(busDoor, { autoAlpha: 0, duration: .3 }, 4.15)
    .to(busDoor, { autoAlpha: 1, duration: .34 }, 8.02)
    .addLabel('Bus departs', 8.65)
    .to(busActor, { x: bus.exit, duration: 5.25, ease: 'power1.in' }, 'Bus departs')
    .addLabel('Plane lands', .1)
    .to(runwayPlane, {
      motionPath: {
        path: [{ x: plane.startX, y: plane.startY }, { x: plane.startX * .5, y: plane.startY * .5 }, { x: plane.touchX, y: 0 }],
      },
      duration: 2.9, ease: 'power1.out',
    }, 'Plane lands')
    .to(runwayPlane, { x: 0, duration: 1.5, ease: 'power1.out' }, 3)
    .to(runwayPlane, { x: plane.liftX, duration: 1.8, ease: 'power1.in' }, 14.4)
    .to(runwayPlane, {
      motionPath: {
        path: [{ x: plane.liftX, y: 0 }, { x: plane.exitX * .42, y: plane.exitY * .15 }, { x: plane.exitX, y: plane.exitY }],
      },
      duration: 2.7, ease: 'power1.in',
    }, 16.2);

  for (const actor of passengers) {
    const { spec, move } = actor;
    const along = spec.path.map(([x, y]) => ({ x: x - spec.start[0], y: y - spec.start[1] }));
    timeline.to(move, { motionPath: { path: along, curviness: 0 }, duration: spec.walk, ease: 'none' }, spec.at);
    timeline.to(move, { autoAlpha: 0, duration: .14 }, spec.at + spec.walk - .05);
  }

  function update() {
    const time = timeline.time();
    for (const actor of passengers) {
      const elapsed = time - actor.spec.at;
      frameAt(actor, elapsed > 0 && elapsed < actor.spec.walk ? [1, 2, 3, 2][Math.floor(elapsed * 7) % 4] : 0);
    }
    seek.value = time;
    seconds.textContent = time.toFixed(1) + ' s';
    phase.textContent = cues.findLast(([start]) => start <= time)[1];
    play.textContent = time >= duration ? 'Replay scene' : timeline.paused() ? 'Play scene' : 'Pause';
  }

  function inspect(time) {
    timeline.pause().time(time);
    update();
  }

  play.addEventListener('click', () => {
    if (timeline.progress() >= 1) timeline.restart();
    else timeline.paused(!timeline.paused());
    update();
  }, options);
  reset.addEventListener('click', () => inspect(0), options);
  seek.addEventListener('input', () => inspect(Number(seek.value)), options);
  for (const button of moments) button.addEventListener('click', () => inspect(stops[button.dataset.moment]), options);
  let resumeOnShow = false;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      resumeOnShow = !timeline.paused() && timeline.progress() < 1;
      timeline.pause();
    } else if (resumeOnShow) timeline.resume();
    update();
  }, options);
  update();
  return () => {
    controller.abort();
    for (const actor of passengers) frameAt(actor, 0);
  };
});

window.addEventListener('pagehide', (event) => {
  if (!event.persisted) {
    observer.disconnect();
    media.revert();
  }
});
