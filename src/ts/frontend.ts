import { toString } from "qrcode";

document.addEventListener("DOMContentLoaded", function () {
  const ratingElements = document.querySelectorAll(
    ".foodblogkitchen-toolkit--recipe-block--rating.foodblogkitchen-toolkit--recipe-block--interactive"
  );

  const storeRatingInDatabase = function (postId: string, rating: string) {
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
  };

  const markAsSelected = function (selectedStarElement: HTMLElement) {
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
  };

  if (ratingElements) {
    ratingElements.forEach((ratingElement) => {
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
              markAsSelected(starElement);

              const rating = starElement.getAttribute("data-rating");

              if (!rating) {
                return;
              }

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
          const ratingWrapper = ratingElement.closest<HTMLElement>(
            ".foodblogkitchen-toolkit--recipe-block--user-rating"
          );

          if (!ratingWrapper) {
            return;
          }

          ratingWrapper.style.display = "none";
        } catch (e) {
          console.error(e);
          debugger;
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
    });
  }

  let servings: number | null = null;
  let ingredientsTable: HTMLTableElement | null = null;
  let shrinkButton: HTMLElement | null = null;
  let increaseButton: HTMLElement | null = null;
  let servingsDisplay: HTMLElement | null = null;

  // Servings calculator
  const initServingCalculator = function () {
    const servingsEditorElement = document.querySelector(
      ".foodblogkitchen-toolkit--recipe-block--servings-editor"
    );

    ingredientsTable = document.querySelector(
      ".foodblogkitchen-toolkit--recipe-block--ingredients"
    );

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
            if (!servings) {
              return;
            }

            if (servings > 1) {
              servings--;
              refreshServingsDisplay();
              refreshIngredients();
            }
          });
        }

        if (increaseButton) {
          increaseButton.addEventListener("click", function () {
            if (!servings) {
              return;
            }

            servings++;
            refreshServingsDisplay();
            refreshIngredients();
          });
        }
      }
    }
  };

  const refreshServingsDisplay = function () {
    if (!servings) {
      return;
    }

    if (!servingsDisplay) {
      return;
    }

    servingsDisplay.innerText = "" + servings;
  };

  const refreshIngredients = function () {
    if (ingredientsTable) {
      const yieldUnit = ingredientsTable.getAttribute("data-recipe-yield-unit");
      const baseYield = parseInt(
        ingredientsTable.getAttribute("data-recipe-yield") || "1",
        10
      );

      ingredientsTable
        .querySelectorAll<HTMLElement>(
          "tr .foodblogkitchen-toolkit--recipe-block--amount"
        )
        .forEach((amountElement) => {
          const amount = parseFloat(
            amountElement.getAttribute("data-recipe-amount") || ""
          );

          if (!amount) {
            // Item without amount
            return;
          }

          const unit = amountElement.getAttribute("data-recipe-unit");

          let baseAmount;
          if (yieldUnit === "springform-pan") {
            baseAmount = amount;
          } else {
            baseAmount = amount / baseYield;
          }

          let baseUnit;

          if (unit) {
            if (unit.match(/^(g|ml)$/i)) {
              baseUnit = unit;
            } else if (unit.match(/^(kilo|kilogramm|kg)$/i)) {
              baseUnit = "g";
              if (baseAmount) {
                baseAmount = baseAmount / 1000;
              }
            } else if (unit.match(/^(liter)$/i)) {
              baseUnit = "ml";
              if (baseAmount) {
                baseAmount = baseAmount / 1000;
              }
            } else {
              baseUnit = unit;
            }
          }

          if (!servings) {
            return;
          }

          let newAmount;
          if (yieldUnit === "springform-pan") {
            const factor =
              (Math.pow(baseYield, 2) * Math.PI) /
              (Math.pow(servings, 2) * Math.PI);
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

          let formattedAmount = "" + newAmount;
          try {
            formattedAmount = new Intl.NumberFormat("de-DE", {
              maximumFractionDigits: 2,
            }).format(newAmount);
          } catch (e) {}

          if (amountElement) {
            amountElement.innerText =
              formattedAmount + (newUnit ? " " + newUnit : "");
          }
        });
    }
  };

  const printContainer = async function (recipeContainer: HTMLElement) {
    const printIframe = document.createElement("iframe");
    printIframe.src = "about:blank";
    printIframe.style.position = "fixed";
    printIframe.style.top = "0px";
    printIframe.style.left = "-999em";

    document.body.appendChild(printIframe);

    const recipeContainerClone = recipeContainer.cloneNode(true) as HTMLElement;

    // Remove Ad Slots
    const adSlots = recipeContainerClone.querySelectorAll(".adsbygoogle");
    adSlots.forEach((adSlot) => {
      adSlot.parentElement?.removeChild(adSlot);
    });

    const titleContainer = recipeContainerClone.querySelector(
      ".foodblogkitchen-toolkit--recipe-block--title"
    );
    const introContainer = recipeContainerClone.querySelector(
      ".foodblogkitchen-toolkit--recipe-block--intro"
    );
    const timingListContainer = recipeContainerClone.querySelector(
      ".foodblogkitchen-toolkit--recipe-block--timings"
    );
    const ingredientsContainer = recipeContainerClone.querySelector(
      ".foodblogkitchen-toolkit--recipe-block--ingredients"
    );
    const preparationStepsContainer = recipeContainerClone.querySelector(
      ".foodblogkitchen-toolkit--recipe-block--preparation-steps"
    );
    const notesContainer = recipeContainerClone.querySelector(
      ".foodblogkitchen-toolkit--recipe-block--notes"
    );
    const imageContainer = recipeContainerClone.querySelector(
      ".foodblogkitchen-toolkit--recipe-block--thumbnail"
    );

    Promise.all([
      new Promise((resolve, reject) => {
        printIframe.onload = resolve;
      }),
      (printIframe.contentDocument as any)?.fonts.ready,
    ])
      .then(() => {
        printIframe.contentWindow?.focus();
        printIframe.contentWindow?.print();
      })
      .catch((error) => {
        console.error(error);
      });

    const styleElement = document.getElementById(
      "foodblogkitchen-toolkit-recipe-block-css"
    );
    const url =
      styleElement?.getAttribute("href") ||
      window.location.origin +
        "/wp-content/plugins/foodblogkitchen-toolkit/build/style-editor.css?cb=" +
        new Date().getTime();

    const svgStringQrCode = await toString(window.location.href, {
      type: "svg",
      margin: 0,
    });

    const topline =
      window.FoodblogkitchenToolkit.config.blogName || location.hostname;

    printIframe.contentWindow?.document.write(
      `<html>
        <head>
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <link href="${url}" rel="stylesheet" />
        </head>
        <body class="foodblogkitchen-toolkit--block">
          <div class="title">
            <div class="left">
              <div class="topline">${topline}</div>
              ${titleContainer?.outerHTML}
            </div>
            <div class="right">
              ${svgStringQrCode}
              <p class="qr-hint"><small>Link zum Rezept</small></p>
            </div>
          </div>
          <header>
            ${introContainer?.outerHTML}
            ${timingListContainer?.outerHTML}
          </header>
          ${imageContainer?.outerHTML}
          <aside>
            ${ingredientsContainer?.outerHTML}
          </aside>
          <main>
            ${preparationStepsContainer?.outerHTML}
            ${notesContainer?.outerHTML}
          </main>
          <footer>
            <div class="footer-inner">
            </div>
          </footer>
        </body>
      </html>`
    );
    printIframe.contentWindow?.document.close();

    // Cleanup after closing the print dialog
    printIframe.contentWindow?.addEventListener("afterprint", (event) => {
      printIframe.parentElement?.removeChild(printIframe);
    });
  };

  const initPrintButtons = function () {
    const buttons = document.querySelectorAll(
      ".foodblogkitchen-toolkit--recipe-block--print-button"
    );

    if (buttons) {
      Array.from(buttons).forEach((button) => {
        const recipeContainer = button.closest<HTMLElement>(
          ".foodblogkitchen-toolkit--block"
        );

        if (!recipeContainer) {
          return;
        }

        button.addEventListener("click", function (event) {
          event.preventDefault();
          printContainer(recipeContainer);
        });
      });
    }
  };

  initServingCalculator();
  initPrintButtons();
});
