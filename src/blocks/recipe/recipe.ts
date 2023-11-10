import { Rating } from "./rating";
import { WakeLock } from "./wake-lock";

export class Recipe {
  constructor(private element: HTMLElement) {
    this.initRating();
    this.initWakeLock();

    this.element.dispatchEvent(
      new CustomEvent("recipe-plugin-for-wp:recipe-ready", { bubbles: true })
    );
  }

  private initRating() {
    const ratingElements = this.element.querySelectorAll<HTMLElement>(
      ".recipe-plugin-for-wp--recipe-block--rating.recipe-plugin-for-wp--recipe-block--interactive"
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
