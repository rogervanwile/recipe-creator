import "./view.scss";

import { Recipe } from "./recipe";

document.addEventListener("DOMContentLoaded", function () {
  const recipeElements = document.querySelectorAll<HTMLElement>(
    ".recipe-master--recipe-block"
  );

  recipeElements.forEach((recipeElement) => new Recipe(recipeElement));
});
