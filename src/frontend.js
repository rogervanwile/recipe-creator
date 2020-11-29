document.addEventListener("DOMContentLoaded", function () {
  var ratingElements = document.querySelectorAll(
    ".foodblogkitchen-recipes--block--rating.foodblogkitchen-recipes--block--interactive"
  );

  var storeRatingInDatabase = function (postId, rating) {
    fetch(FoodblogKitchenRecipes.config.ajaxUrl, {
      method: "POST",
      body: new URLSearchParams({
        _ajax_nonce: FoodblogKitchenRecipes.config.nonce,
        action: "foodblogkitchen_recipes_set_rating",
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
                '"] .foodblogkitchen-recipes--block--average-voting'
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
        "foodblogkitchen-recipes::" + postId
      );

      if (!savedRating) {
        ratingElement
          .querySelectorAll(".foodblogkitchen-recipes--block--star")
          .forEach((starElement) => {
            starElement.addEventListener("click", (event) => {
              markAsSelected(starElement);

              var rating = starElement.getAttribute("data-rating");

              // To show the users vote and prevent multiple votes
              window.localStorage.setItem(
                "foodblogkitchen-recipes::" + postId,
                rating
              );

              storeRatingInDatabase(postId, rating);
            });
          });
      } else {
        try {
          // Hide the user rating section if the user has already voted.
          ratingElement.closest(
            ".foodblogkitchen-recipes--block--user-rating"
          ).style.display = "none";
        } catch (e) {
          console.error(e);
          debugger;
        }

        // ratingElement.classList.remove(
        //   "foodblogkitchen-recipes--block--interactive"
        // );
        // var selectedStarElement = ratingElement.querySelector(
        //   '.foodblogkitchen-recipes--block--star[data-rating="' + savedRating + '"]'
        // );
        // if (selectedStarElement) {
        //   markAsSelected(selectedStarElement);
        // }
      }
    });
  }

  var servings = null;
  var ingredientsTable = null;
  var shrinkButton = null;
  var increaseButton = null;
  var servingsDisplay = null;

  // Servings calculator
  var initServingCalculator = function () {
    const servingsEditorElement = document.querySelector(
      ".foodblogkitchen-recipes--block--servings-editor"
    );

    ingredientsTable = document.querySelector(".foodblogkitchen-recipes--block--ingredients");

    if (servingsEditorElement) {
      shrinkButton = servingsEditorElement.querySelector(
        ".recipe-shrink-servings"
      );
      increaseButton = servingsEditorElement.querySelector(
        ".recipe-increase-servings"
      );
      servingsDisplay = servingsEditorElement.querySelector(".recipe-servings");

      if (servingsDisplay) {
        servings = parseInt(servingsDisplay.innerHTML.trim(), 10);

        if (shrinkButton) {
          shrinkButton.addEventListener("click", function () {
            if (servings > 1) {
              servings--;
              refreshServingsDisplay();
              refreshIngredients();
            }
          });
        }

        if (increaseButton) {
          increaseButton.addEventListener("click", function () {
            servings++;
            refreshServingsDisplay();
            refreshIngredients();
          });
        }
      }
    }
  };

  var refreshServingsDisplay = function () {
    servingsDisplay.innerText = servings;
  };

  var refreshIngredients = function () {
    if (ingredientsTable) {
      ingredientsTable
        .querySelectorAll("tr .foodblogkitchen-recipes--block--amount")
        .forEach((amountElement) => {
          const baseAmount = parseFloat(
            amountElement.getAttribute("data-recipe-base-amount"),
            10
          );
          const baseUnit = amountElement.getAttribute("data-recipe-base-unit");

          if (baseAmount) {
            let amount = baseAmount * servings;
            let unit = baseUnit; // TODO: Umrechnen ^^

            if (amount >= 1000) {
              switch (unit) {
                case "g":
                  unit = "kg";
                  amount = amount / 1000;
                  break;
                case "ml":
                  unit = "l";
                  amount = amount / 1000;
                  break;
              }
            }

            let formattedAmount = amount;
            try {
              formattedAmount = new Intl.NumberFormat("de-DE").format(amount);
            } catch (e) {}

            if (amountElement) {
              amountElement.innerText = formattedAmount + " " + unit;
            }
          }
        });
    }
  };

  initServingCalculator();
});
