export class Rating {
  private constructionDate = new Date();

  private ratingInProgress = false;

  constructor(private ratingElement: HTMLElement) {
    const postId = ratingElement.getAttribute("data-post-id") || null;

    if (!postId) {
      return;
    }

    this.initEvents();

    if (!this.hasSavedRating(postId)) {
      ratingElement.querySelectorAll<HTMLElement>(".recipe-creator--recipe-block--star").forEach((starElement) => {
        starElement.addEventListener("click", (event) => {
          const currentDate = new Date();
          const diff = Math.abs(this.constructionDate.getTime() - currentDate.getTime());

          if (diff < 2000) {
            // The user rated the recipe in less than 2 seconds.
            // This rating can be ignored because it must be a spam bot.
            return;
          }

          if (this.ratingInProgress) {
            return;
          }

          if (this.hasSavedRating(postId)) {
            return;
          }

          this.ratingInProgress = true;

          const rating = starElement.getAttribute("data-rating");
          if (!rating) {
            return;
          }

          window.RecipeCreatorEventManager.emit("recipe-creator:rating-clicked", { postId, rating: +rating });
        });
      });
    } else {
      this.hideRating();
    }
  }

  private hasSavedRating(postId: string) {
    return !!window.localStorage.getItem("recipe-creator::" + postId);
  }

  private initEvents() {
    window.RecipeCreatorEventManager.on(
      "recipe-creator:rating-clicked",
      async (data: { postId: string; rating: number }) => {
        window.localStorage.setItem("recipe-creator::" + data.postId, "" + data.rating);
        const response = await this.storeRatingInDatabase(data.postId, data.rating);

        window.RecipeCreatorEventManager.emit("recipe-creator:recipe-rated", { ...data, ...response });
      },
    );

    window.RecipeCreatorEventManager.on(
      "recipe-creator:recipe-rated",
      (data: { postId: string; rating: number; averageRating: number }) => {
        if (data.averageRating) {
          const averageVotingElement = this.ratingElement.querySelector(
            ".recipe-creator--recipe-block--average-voting",
          );

          if (averageVotingElement) {
            averageVotingElement.innerHTML = "" + data.averageRating;
          }
        }

        const selectedStarElement = this.ratingElement.querySelector<HTMLElement>(
          '.recipe-creator--recipe-block--star[data-rating="' + data.rating + '"]',
        );
        if (selectedStarElement) {
          this.markAsSelected(selectedStarElement);
        }

        this.ratingElement.classList.remove("recipe-creator--recipe-block--interactive");

        this.ratingInProgress = false;
      },
    );
  }

  private hideRating() {
    // Hide the user rating section if the user has already voted.
    const ratingWrapper = this.ratingElement?.closest<HTMLElement>(".recipe-creator--recipe-block--user-rating");

    if (!ratingWrapper) {
      return;
    }

    ratingWrapper.style.display = "none";
  }

  private storeRatingInDatabase(postId: string, rating: number) {
    return new Promise<{ averageRating: number }>((resolve, reject) => {
      return fetch(window.recipeCreatorConfig.ajaxUrl, {
        method: "POST",
        body: new URLSearchParams({
          _ajax_nonce: window.recipeCreatorConfig.nonce,
          action: "recipe_creator_set_rating",
          postId,
          rating: "" + rating,
        }),
      })
        .then(async (response) => {
          if (response.status === 400) {
            return;
          }

          const responseData = await response.json();

          resolve({ averageRating: responseData?.data?.averageRating || 0 });
        })
        .catch((error) => {
          console.error(error);
          reject();
        });
    });
  }

  private markAsSelected(selectedStarElement: HTMLElement) {
    let foundItem = false;

    const children = selectedStarElement.parentElement?.children;

    if (!children) {
      return;
    }

    for (let element of children) {
      if (element === selectedStarElement) {
        element.classList.add("selected");
        foundItem = true;
      } else if (!foundItem) {
        element.classList.add("selected");
      } else if (foundItem) {
        element.classList.remove("selected");
      }
    }
  }
}
