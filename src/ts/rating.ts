export class Rating {
  constructor(ratingElement: HTMLElement) {
    const postId = ratingElement.getAttribute("data-post-id");

    if (!postId) {
      return;
    }

    const savedRating = window.localStorage.getItem(
      "foodblogkitchen-toolkit::" + postId
    );

    if (!savedRating) {
      ratingElement
        .querySelectorAll<HTMLElement>(
          ".foodblogkitchen-toolkit--recipe-block--star"
        )
        .forEach((starElement) => {
          starElement.addEventListener("click", (event) => {
            this.markAsSelected(starElement);

            const rating = starElement.getAttribute("data-rating");

            if (!rating) {
              return;
            }

            // To show the users vote and prevent multiple votes
            window.localStorage.setItem(
              "foodblogkitchen-toolkit::" + postId,
              rating
            );

            this.storeRatingInDatabase(postId, rating);
          });
        });
    } else {
      try {
        // Hide the user rating section if the user has already voted.
        const ratingWrapper = ratingElement.closest<HTMLElement>(
          ".foodblogkitchen-toolkit--recipe-block--user-rating"
        );

        if (!ratingWrapper) {
          return;
        }

        ratingWrapper.style.display = "none";
      } catch (e) {
        console.error(e);
      }

      // ratingElement.classList.remove(
      //   "foodblogkitchen-toolkit--recipe-block--interactive"
      // );
      // const selectedStarElement = ratingElement.querySelector(
      //   '.foodblogkitchen-toolkit--recipe-block--star[data-rating="' + savedRating + '"]'
      // );
      // if (selectedStarElement) {
      //   markAsSelected(selectedStarElement);
      // }
    }
  }

  private storeRatingInDatabase(postId: string, rating: string) {
    fetch(window.FoodblogkitchenToolkit.config.ajaxUrl, {
      method: "POST",
      body: new URLSearchParams({
        _ajax_nonce: window.FoodblogkitchenToolkit.config.nonce,
        action: "foodblogkitchen_toolkit_set_rating",
        postId: postId,
        rating: rating,
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
                '"] .foodblogkitchen-toolkit--recipe-block--average-voting'
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
