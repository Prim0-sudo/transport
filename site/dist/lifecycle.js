// Active-time work belongs to the current screen/round. Named holds overlap.
// This controls the existing CSS animations; new scene choreography uses GSAP.
class TransportLifecycle {
  constructor({ onHold = () => {} } = {}) {
    this.tasks = new Set();
    this.holds = new Set();
    this.epoch = 0;
    this.onHold = onHold;
    this.animations = [];
    this.previousFocus = null;
    this.onVisibility = () => this.setHold("hidden", document.hidden);
    document.addEventListener("visibilitychange", this.onVisibility);
    this.onVisibility();
  }

  get held() { return this.holds.size > 0; }

  schedule(callback, delay) {
    const task = { callback, remaining: Math.max(0, delay), epoch: this.epoch, timer: null };
    this.tasks.add(task);
    if (!this.held) this.arm(task);
    return task;
  }

  arm(task) {
    task.started = performance.now();
    task.timer = setTimeout(() => {
      task.timer = null;
      if (!this.tasks.delete(task) || task.epoch !== this.epoch) return;
      task.callback();
    }, task.remaining);
  }

  cancelTask(task) {
    if (!task) return;
    clearTimeout(task.timer);
    this.tasks.delete(task);
  }

  cancel() {
    this.epoch++;
    for (const task of this.tasks) clearTimeout(task.timer);
    this.tasks.clear();
  }

  setHold(reason, enabled) {
    const wasHeld = this.held;
    if (enabled) this.holds.add(reason);
    else this.holds.delete(reason);
    if (wasHeld === this.held) return;

    const shell = document.querySelector(".shell");
    if (this.held) {
      for (const task of this.tasks) {
        if (task.timer === null) continue;
        clearTimeout(task.timer);
        task.timer = null;
        task.remaining = Math.max(0, task.remaining - (performance.now() - task.started));
      }
      this.previousFocus = document.activeElement;
      this.animations = document.getAnimations().filter(animation => animation.playState === "running");
      this.animations.forEach(animation => animation.pause());
      if (shell) shell.inert = true;
    } else {
      if (shell) shell.inert = false;
      this.animations.forEach(animation => {
        if (animation.effect?.target?.isConnected && animation.playState === "paused") animation.play();
      });
      this.animations = [];
      for (const task of this.tasks) this.arm(task);
      if (this.previousFocus?.isConnected && !this.previousFocus.closest("[hidden], .screen:not(.active)")) {
        this.previousFocus.focus({ preventScroll: true });
      }
      this.previousFocus = null;
    }
    this.onHold(this.held);
  }

  destroy() {
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.cancel();
    for (const reason of [...this.holds]) this.setHold(reason, false);
  }
}
