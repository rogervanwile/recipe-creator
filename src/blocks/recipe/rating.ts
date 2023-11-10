export class Rating {
  private constructionDate = new Date();

  private hasRated = false;

  constructor(private ratingElement: HTMLElement) {
    const postId = ratingElement.getAttribute("data-post-id");

    if (!postId) {
      return;
    }

    const savedRating = window.localStorage.getItem(
      "recipe-plugin-for-wp::" + postId
    );

    if (!savedRating) {
      ratingElement
        .querySelectorAll<HTMLElement>(
          ".recipe-plugin-for-wp--recipe-block--star"
        )
        .forEach((starElement) => {
          starElement.addEventListener("click", (event) => {
            this.markAsSelected(starElement);

            if (this.hasRated) {
              // Only one rating is allowed
              return;
            }

            this.hasRated = true;

            const rating = starElement.getAttribute("data-rating");

            if (!rating) {
              return;
            }

            // To show the users vote and prevent multiple votes
            window.localStorage.setItem(
              "recipe-plugin-for-wp::" + postId,
              rating
            );

            this.storeRatingInDatabase(postId, rating);
          });
        });
    } else {
      this.hideRating();
    }
  }

  private hideRating() {
    // Hide the user rating section if the user has already voted.
    const ratingWrapper = this.ratingElement?.closest<HTMLElement>(
      ".recipe-plugin-for-wp--recipe-block--user-rating"
    );

    if (!ratingWrapper) {
      return;
    }

    ratingWrapper.style.display = "none";
  }

  private storeRatingInDatabase(postId: string, rating: string) {
    const currentDate = new Date();
    const diff = Math.abs(
      this.constructionDate.getTime() - currentDate.getTime()
    );

    if (diff < 5000) {
      // The user rated the recipe in unter 5 seconds.
      // This rating can be ignored cause it must be a spam bot.
      return;
    }

    fetch(window.recipePluginForWPConfig.ajaxUrl, {
      method: "POST",
      body: new URLSearchParams({
        _ajax_nonce: window.recipePluginForWPConfig.nonce,
        action: "recipe_plugin_for_wp_set_rating",
        postId,
        rating,
      }),
    })
      .then((response) => {
        if (response.status === 400) {
          return;
        }

        response.json().then((responseData) => {
          if (
            responseData &&
            responseData.data &&
            responseData.data.averageRating
          ) {
            const averageVotingElement = document.querySelector(
              '[data-post-id="' +
                postId +
                '"] .recipe-plugin-for-wp--recipe-block--average-voting'
            );

            if (averageVotingElement) {
              averageVotingElement.innerHTML = responseData.data.averageRating;
            }
          }
        });
      })
      .catch((error) => {
        console.error(error);
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
