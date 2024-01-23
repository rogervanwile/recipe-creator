import { Rating } from "./rating";

export class Recipe {
  constructor(private element: HTMLElement) {
    this.initRating();

    this.element.dispatchEvent(new CustomEvent("recipe-creator:recipe-ready", { bubbles: true }));
  }

  private initRating() {
    const ratingElements = this.element.querySelectorAll<HTMLElement>(
      ".recipe-creator--recipe-block--rating.recipe-creator--recipe-block--interactive",
    );

    if (ratingElements) {
      ratingElements.forEach((ratingElement) => {
        new Rating(ratingElement);
      });
    }
  }
}
