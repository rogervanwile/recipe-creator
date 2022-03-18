export class Calculator {
  private servings: number | null = null;
  private servingsSelector: HTMLTableElement | null = null;
  private ingredientsTable: HTMLTableElement | null = null;
  private shrinkButton: HTMLElement | null = null;
  private increaseButton: HTMLElement | null = null;
  private servingsDisplay: HTMLElement | null = null;

  constructor(recipeElement: HTMLElement) {
    this.servingsSelector = recipeElement.querySelector(
      ".foodblogkitchen-toolkit--recipe-block--servings-editor"
    );

    this.ingredientsTable = recipeElement.querySelector(
      ".foodblogkitchen-toolkit--recipe-block--ingredients-table"
    );

    if (this.servingsSelector && this.ingredientsTable) {
      this.init();
    }
  }

  // Servings calculator
  private init() {
    this.shrinkButton = this.servingsSelector!.querySelector(
      ".recipe-shrink-servings"
    );
    this.increaseButton = this.servingsSelector!.querySelector(
      ".recipe-increase-servings"
    );
    this.servingsDisplay = this.servingsSelector!.querySelector(
      ".recipe-servings"
    );

    if (this.servingsDisplay) {
      this.servings = parseInt(this.servingsDisplay.innerHTML.trim(), 10);

      if (this.shrinkButton) {
        this.shrinkButton.addEventListener("click", () => {
          if (!this.servings) {
            return;
          }

          if (this.servings > 1) {
            this.servings--;
            this.refreshServingsDisplay();
            this.refreshIngredients();
          }
        });
      }

      if (this.increaseButton) {
        this.increaseButton.addEventListener("click", () => {
          if (!this.servings) {
            return;
          }

          this.servings++;
          this.refreshServingsDisplay();
          this.refreshIngredients();
        });
      }
    }
  }

  private refreshServingsDisplay() {
    if (!this.servings) {
      return;
    }

    if (!this.servingsDisplay) {
      return;
    }

    this.servingsDisplay.innerText = "" + this.servings;
  }

  private refreshIngredients() {
    if (this.ingredientsTable) {
      const yieldUnit = this.ingredientsTable.getAttribute(
        "data-recipe-yield-unit"
      );
      const baseYield = parseInt(
        this.ingredientsTable.getAttribute("data-recipe-yield") || "1",
        10
      );

      this.ingredientsTable
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

          if (!this.servings) {
            return;
          }

          let newAmount;
          if (yieldUnit === "springform-pan") {
            const factor =
              (Math.pow(baseYield, 2) * Math.PI) /
              (Math.pow(this.servings, 2) * Math.PI);
            newAmount = baseAmount / factor;
          } else {
            newAmount = baseAmount * this.servings;
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
  }
}
