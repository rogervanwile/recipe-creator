import { Calculator } from "./calculator";
import { Printer } from "./printer";
import { Rating } from "./rating";
import { WakeLock } from "./wake-lock";

export class Recipe {
  constructor(private element: HTMLElement) {
    this.initRating();
    this.initCalculator();
    this.initPrinting();
    this.initWakeLock();
  }

  private initRating() {
    const ratingElements = this.element.querySelectorAll<HTMLElement>(
      ".foodblogkitchen-toolkit--recipe-block--rating.foodblogkitchen-toolkit--recipe-block--interactive"
    );

    if (ratingElements) {
      ratingElements.forEach((ratingElement) => {
        new Rating(ratingElement);
      });
    }
  }

  private initCalculator() {
    new Calculator(this.element);
  }

  private initPrinting() {
    const printButton = this.element.querySelector(
      ".foodblogkitchen-toolkit--recipe-block--print-button"
    );

    if (!printButton) {
      return;
    }

    printButton.addEventListener("click", (event) => {
      event.preventDefault();

      new Printer(this.element);
    });
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
