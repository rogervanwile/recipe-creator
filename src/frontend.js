document.addEventListener("DOMContentLoaded", function () {
  var ratingElements = document.querySelectorAll(
    ".foodblogkitchen-toolkit--recipe-block--rating.foodblogkitchen-toolkit--recipe-block--interactive"
  );

  var storeRatingInDatabase = function (postId, rating) {
    fetch(FoodblogkitchenToolkit.config.ajaxUrl, {
      method: "POST",
      body: new URLSearchParams({
        _ajax_nonce: FoodblogkitchenToolkit.config.nonce,
        action: "foodblogkitchen_toolkit_set_rating",
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
        "foodblogkitchen-toolkit::" + postId
      );

      if (!savedRating) {
        ratingElement
          .querySelectorAll(".foodblogkitchen-toolkit--recipe-block--star")
          .forEach((starElement) => {
            starElement.addEventListener("click", (event) => {
              markAsSelected(starElement);

              var rating = starElement.getAttribute("data-rating");

              // To show the users vote and prevent multiple votes
              window.localStorage.setItem(
                "foodblogkitchen-toolkit::" + postId,
                rating
              );

              storeRatingInDatabase(postId, rating);
            });
          });
      } else {
        try {
          // Hide the user rating section if the user has already voted.
          ratingElement.closest(
            ".foodblogkitchen-toolkit--recipe-block--user-rating"
          ).style.display = "none";
        } catch (e) {
          console.error(e);
          debugger;
        }

        // ratingElement.classList.remove(
        //   "foodblogkitchen-toolkit--recipe-block--interactive"
        // );
        // var selectedStarElement = ratingElement.querySelector(
        //   '.foodblogkitchen-toolkit--recipe-block--star[data-rating="' + savedRating + '"]'
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
      ".foodblogkitchen-toolkit--recipe-block--servings-editor"
    );

    ingredientsTable = document.querySelector(".foodblogkitchen-toolkit--recipe-block--ingredients");

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
      const yieldUnit = ingredientsTable.getAttribute('data-recipe-yield-unit');
      const baseYield = ingredientsTable.getAttribute('data-recipe-yield') || 1;

      ingredientsTable
        .querySelectorAll("tr .foodblogkitchen-toolkit--recipe-block--amount")
        .forEach((amountElement) => {
          const amount = parseFloat(amountElement.getAttribute('data-recipe-amount'), 10);

          if (!amount) {
            // Item without amount
            return;
          }

          const unit = amountElement.getAttribute('data-recipe-unit');

          let baseAmount;
          if (yieldUnit === 'springform-pan') {
            baseAmount = amount;
          } else {
            baseAmount = amount / baseYield
          }

          let baseUnit;

          if (unit) {
            if (unit.match(/^(g|ml)$/i)) {
              baseUnit = unit;
            } else if (unit.match(/^(kilo|kilogramm|kg)$/i)) {
              baseUnit = 'g';
              if (baseAmount) {
                baseAmount = baseAmount / 1000;
              }
            } else if (unit.match(/^(liter)$/i)) {
              baseUnit = 'ml';
              if (baseAmount) {
                baseAmount = baseAmount / 1000;
              }
            } else {
              baseUnit = unit;
            }
          }

          let newAmount;
          if (yieldUnit === 'springform-pan') {
            const factor = (Math.pow(baseYield, 2) * Math.PI) / (Math.pow(servings, 2) * Math.PI);
            newAmount = baseAmount / factor;
          } else {
            newAmount = baseAmount * servings;
          }

          let newUnit = baseUnit;

          if (newAmount >= 1000) {
            switch (newUnit) {
              case "g":
                newUnit = "kg";
                newAmount = newAmount / 1000;
                break;
              case "ml":
                newUnit = "l";
                newAmount = newAmount / 1000;
                break;
            }
          }

          let formattedAmount = newAmount;
          try {
            formattedAmount = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 }).format(newAmount);
          } catch (e) { }

          if (amountElement) {
            amountElement.innerText = formattedAmount + (newUnit ? " " + newUnit : '');
          }
        });
    }
  };

  var hiddenElements = [];

  var hideSiblings = function (container) {
    Array.from(container.parentElement.children).forEach(child => {
      if (child !== container) {
        child.style.display = 'none';
        hiddenElements.push(child);
      }
    });
  }

  var printContainer = function (recipeContainer) {
    if (recipeContainer) {
      recipeContainer.classList.add('print-mode');

      // Iterate through all previous and next siblings of the container 
      // and hide them to not print them
      let parent = recipeContainer;
      do {
        hideSiblings(parent);
        parent = parent.parentElement;
      } while (parent !== document.body);

      window.print()

      // Show the hidden container again
      if (hiddenElements.length) {
        while (hiddenElements.length) {
          const element = hiddenElements.pop();
          element.style.display = '';
        };
      }

      recipeContainer.classList.remove('print-mode');
    } else {
      console.error('No container for printing defined');
    }
  };

  var initPrintButtons = function () {
    const buttons = document.querySelectorAll(
      ".foodblogkitchen-toolkit--recipe-block--print-button"
    );

    if (buttons) {
      Array.from(buttons).forEach(button => {
        const recipeContainer = button.closest('.foodblogkitchen-toolkit--block');
        button.addEventListener('click', function (event) {
          event.preventDefault();
          printContainer(recipeContainer);
        });
      });
    }
  };

  initServingCalculator();
  initPrintButtons();
});
