import "./view.scss";

import { Recipe } from "./recipe";

document.addEventListener("DOMContentLoaded", function () {
  const recipeElements = document.querySelectorAll<HTMLElement>(
    ".recipe-plugin-for-wp--recipe-block"
  );

  recipeElements.forEach((recipeElement) => new Recipe(recipeElement));
});
