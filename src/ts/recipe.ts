import { Calculator } from "./calculator";
import { Printer } from "./printer";
import { Rating } from "./rating";

export class Recipe {
  constructor(private element: HTMLElement) {
    console.log("construct", element);
    this.initRating();
    this.initCalculator();
    this.initPrinting();
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
}
