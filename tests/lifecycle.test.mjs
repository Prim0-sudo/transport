import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function harness() {
  let now = 0, nextId = 0, focusCount = 0;
  const timers = new Map(), listeners = new Map(), holds = [];
  const shell = { inert: false };
  const animation = {
    playState: 'running', effect: { target: { isConnected: true } },
    pause() { this.playState = 'paused'; }, play() { this.playState = 'running'; }
  };
  const document = {
    hidden: false,
    activeElement: { isConnected: true, closest: () => null, focus() { focusCount++; } },
    addEventListener(type, callback) { listeners.set(type, callback); },
    removeEventListener(type) { listeners.delete(type); },
    querySelector: () => shell,
    getAnimations: () => [animation]
  };
  const context = vm.createContext({
    document, performance: { now: () => now },
    setTimeout(callback, delay) { const id = ++nextId; timers.set(id, { callback, at: now + delay }); return id; },
    clearTimeout(id) { timers.delete(id); }
  });
  vm.runInContext(fs.readFileSync(new URL('../site/dist/lifecycle.js', import.meta.url), 'utf8'), context);
  context.notify = held => holds.push(held);
  const work = vm.runInContext('new TransportLifecycle({onHold: notify})', context);
  return {
    work, document, shell, animation, timers, holds,
    focusCount: () => focusCount,
    visibility(hidden) { document.hidden = hidden; listeners.get('visibilitychange')(); },
    advance(ms) {
      const until = now + ms;
      while (true) {
        const ready = [...timers].filter(([, task]) => task.at <= until).sort((a, b) => a[1].at - b[1].at)[0];
        if (!ready) break;
        now = ready[1].at; timers.delete(ready[0]); ready[1].callback();
      }
      now = until;
    }
  };
}

test('hidden time does not spend the remainder of a task or finish its animation', () => {
  const h = harness(); let count = 0;
  h.work.schedule(() => count++, 100);
  h.advance(40); h.visibility(true); h.advance(5000);
  assert.equal(count, 0); assert.equal(h.shell.inert, true);
  assert.equal(h.animation.playState, 'paused');
  h.visibility(false); h.advance(59); assert.equal(count, 0);
  h.advance(1); assert.equal(count, 1);
  assert.equal(h.animation.playState, 'running'); assert.equal(h.focusCount(), 1);
});

test('returning to a visible tab cannot release a Teacher hold', () => {
  const h = harness(); let count = 0;
  h.work.setHold('teacher', true); h.visibility(true);
  h.work.schedule(() => count++, 20);
  h.visibility(false); h.advance(1000);
  assert.equal(count, 0); assert.equal(h.shell.inert, true);
  assert.deepEqual(h.holds, [true]);
  h.work.setHold('teacher', false); h.advance(20);
  assert.equal(count, 1); assert.deepEqual(h.holds, [true, false]);
});

test('navigation cancels pending and already-queued callbacks across rounds', () => {
  const h = harness(); let old = 0, current = 0;
  h.work.schedule(() => old++, 100);
  const queued = [...h.timers.values()][0].callback;
  h.work.cancel(); h.work.schedule(() => current++, 20);
  queued(); h.advance(1000);
  assert.equal(old, 0); assert.equal(current, 1);
});

test('new work scheduled while held starts only on the final release; cancelled work stays cancelled', () => {
  const h = harness(); let count = 0;
  h.visibility(true);
  const abandoned = h.work.schedule(() => count += 100, 10);
  h.work.cancelTask(abandoned);
  h.work.schedule(() => { count++; h.work.schedule(() => count++, 5); }, 10);
  h.advance(1000); assert.equal(count, 0);
  h.visibility(false); h.advance(15); assert.equal(count, 2);
});

test('destroy cancels delayed work and detaches visibility ownership', () => {
  const h = harness(); let count = 0;
  h.work.schedule(() => count++, 10); h.work.destroy(); h.advance(100);
  assert.equal(count, 0); assert.equal(h.timers.size, 0);
});
