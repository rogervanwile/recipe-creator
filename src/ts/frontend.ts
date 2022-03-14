import { Recipe } from "./recipe";

document.addEventListener("DOMContentLoaded", function () {
  const recipeElements = document.querySelectorAll<HTMLElement>(
    ".foodblogkitchen-toolkit--recipe-block"
  );

  recipeElements.forEach((recipeElement) => new Recipe(recipeElement));
});
