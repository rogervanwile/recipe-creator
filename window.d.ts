import { EventManager } from "./src/blocks/recipe/EventManager";

declare global {
  interface Window {
    RecipeCreatorEventManager: EventManager;
    recipeCreatorConfig: {
      ajaxUrl: string;
      nonce: string;
    };
  }
}
