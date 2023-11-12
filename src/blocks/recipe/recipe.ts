import { Rating } from "./rating";
import { WakeLock } from "./wake-lock";

export class Recipe {
  constructor(private element: HTMLElement) {
    this.initRating();
    this.initWakeLock();

    this.element.dispatchEvent(
      new CustomEvent("recipe-guru:recipe-ready", { bubbles: true })
    );
  }

  private initRating() {
    const ratingElements = this.element.querySelectorAll<HTMLElement>(
      ".recipe-guru--recipe-block--rating.recipe-guru--recipe-block--interactive"
    );

    if (ratingElements) {
      ratingElements.forEach((ratingElement) => {
        new Rating(ratingElement);
      });
    }
  }

  private initWakeLock() {
    const wakeLockInstance = new WakeLock();

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio) {
          wakeLockInstance.lock();
        } else {
          wakeLockInstance.unlock();
        }
      });
    }, {});

    observer.observe(this.element);
  }
}
