import "./view.scss";

import { Recipe } from "./recipe";
import { EventManager } from "./EventManager";

window["RecipeCreatorEventManager"] = new EventManager();

document.addEventListener("DOMContentLoaded", function () {
  const recipeElements = document.querySelectorAll<HTMLElement>(".recipe-creator--recipe-block");

  recipeElements.forEach((recipeElement) => new Recipe(recipeElement));
});
