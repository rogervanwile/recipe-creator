document.addEventListener("DOMContentLoaded", function () {
  var ratingElements = document.querySelectorAll(
    ".recipe-manager-pro--block--rating"
  );

  var storeRatingInDatabase = function (postId, rating) {
    fetch(RecipeManagerPro.config.ajaxUrl, {
      method: "POST",
      body: new URLSearchParams({
        _ajax_nonce: RecipeManagerPro.config.nonce,
        action: "recipe_manager_pro_set_rating",
        postId: postId,
        rating: rating,
      }),
    })
      .then((response) => {
        if (response === 0 || response.status === 400) {
          return;
        }

        response.json().then((responseData) => {
          if (
            responseData &&
            responseData.data &&
            responseData.data.averageRating
          ) {
            var averageVotingElement = document.querySelector(
              '[data-post-id="' +
                postId +
                '"] .recipe-manager-pro--block--average-voting'
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
  };

  var markAsSelected = function (selectedStarElement) {
    var foundItem = false;

    for (let element of selectedStarElement.parentElement.children) {
      if (element === selectedStarElement) {
        element.classList.add("selected");
        foundItem = true;
      } else if (!foundItem) {
        element.classList.add("selected");
      } else if (foundItem) {
        element.classList.remove("selected");
      }
    }
  };

  if (ratingElements) {
    ratingElements.forEach((ratingElement) => {
      var postId = ratingElement.getAttribute("data-post-id");

      var savedRating = window.localStorage.getItem(
        "recipe-manager-pro::" + postId
      );

      if (!savedRating) {
        ratingElement
          .querySelectorAll(".recipe-manager-pro--block--star")
          .forEach((starElement) => {
            starElement.addEventListener("click", (event) => {
              markAsSelected(starElement);

              var rating = starElement.getAttribute("data-rating");

              // To show the users vote and prevent multiple votes
              // window.localStorage.setItem(
              //   "recipe-manager-pro::" + postId,
              //   rating
              // );

              storeRatingInDatabase(postId, rating);
            });
          });
      } else {
        var selectedStarElement = ratingElement.querySelector(
          '.recipe-manager-pro--block--star[data-rating="' + savedRating + '"]'
        );
        if (selectedStarElement) {
          markAsSelected(selectedStarElement);
        }
      }
    });
  }
});
