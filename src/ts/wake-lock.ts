export class WakeLock {
  private wakeLock: WakeLockSentinel | undefined;

  constructor() {}

  async lock() {
    if (this.wakeLock) {
      // Allready locked
      return;
    }

    this.wakeLock = await navigator.wakeLock?.request("screen");
  }

  async unlock() {
    if (!this.wakeLock) {
      // Allready unlocked
      return;
    }

    await this.wakeLock.release();
    this.wakeLock = undefined;
  }
}
