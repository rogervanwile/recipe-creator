import Color from "color";
import "../styles/admin.scss";

class RecipeCreatorAdminSettings {
  private styleContainer: HTMLElement | null = null;

  private settingsForm: HTMLFormElement;

  constructor() {
    this.settingsForm = document.getElementById("recipe-creator--settings-form") as HTMLFormElement;

    if (!this.settingsForm) {
      console.error("The settings form can not be found.");
      return;
    }

    this.initColorPicker();
    this.initOtherPicker();
  }

  private initColorPicker() {
    if (!this.settingsForm) {
      return;
    }

    const colorPickers = this.settingsForm.querySelectorAll(".recipe-creator--color-picker");
    colorPickers.forEach((colorPicker) => {
      var defaultValue = colorPicker.getAttribute("data-default-value") || null;

      (window as any).jQuery(colorPicker).wpColorPicker({
        defaultColor: defaultValue,
        change: (event: Event, ui: any) => {
          var data: { [key: string]: string } = {};
          const name: string = (event.target as any)?.["name"];
          data[name] = ui.color.toCSS();
          this.refreshStyles(data);
        },
      });
    });
  }

  private initOtherPicker() {
    if (!this.settingsForm) {
      return;
    }

    const inputs = this.settingsForm.querySelectorAll<HTMLInputElement>('input[type="number"],input[type="checkbox"]');

    inputs.forEach((input) => {
      input.addEventListener("change", () => {
        this.refreshStyles();
      });
    });
  }

  private refreshStyles(update = {}) {
    var data: any = {
      ...this.getFormValue(),
      ...update,
    };

    // Calculate light and dark colors

    const calculatedColors: { [key: string]: string } = {};

    Object.keys(data).map((key) => {
      switch (key) {
        case "recipe_creator__primary_color":
          calculatedColors.recipe_creator__primary_color_contrast = this.getContrastColor(data[key]);
          const primaryColorLight = this.lightenColor(data[key]);
          calculatedColors.recipe_creator__primary_color_light = primaryColorLight;
          calculatedColors.recipe_creator__primary_color_light_contrast = this.getContrastColor(primaryColorLight);
          calculatedColors.recipe_creator__primary_color_dark = this.darkenColor(data[key]);
          break;
        case "recipe_creator__secondary_color":
          calculatedColors.recipe_creator__secondary_color_contrast = this.getContrastColor(data[key]);
          break;
        case "recipe_creator__background_color":
          calculatedColors.recipe_creator__background_color_contrast = this.getContrastColor(data[key]);
          break;
      }
    });

    // Add calculated colors in settings form
    Object.keys(calculatedColors).forEach((key) => {
      this.updateSettingsFormField(key, calculatedColors[key]);
    });

    const mergedData = {
      ...data,
      ...calculatedColors,
    };

    var finalHtml = `<style>
.recipe-creator.recipe-creator {
  --background: ${mergedData.recipe_creator__background_color};
  --background-contrast: ${mergedData.recipe_creator__background_color_contrast};
  --secondary: ${mergedData.recipe_creator__secondary_color};
  --secondary-contrast: ${mergedData.recipe_creator__secondary_color_contrast};
  --primary: ${mergedData.recipe_creator__primary_color};
  --primary-contrast: ${mergedData.recipe_creator__primary_color_contrast};
  --primary-light: ${mergedData.recipe_creator__primary_color_light};
  --primary-light-contrast: ${mergedData.recipe_creator__primary_color_light_contrast};
  --primary-dark: ${mergedData.recipe_creator__primary_color_dark};
  --border-radius: ${mergedData.recipe_creator__border_radius}px;
${
  mergedData.recipe_creator__show_box_shadow
    ? "  --box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)"
    : "  --box-shadow: none"
};
${
  mergedData.recipe_creator__show_border
    ? "  --border: 1px solid " + mergedData.recipe_creator__primary_color
    : "  --box-shadow: none"
};
}
</style>`;

    if (!this.styleContainer) {
      this.styleContainer = document.getElementById("recipe-creator--style-container");
    }

    if (!this.styleContainer) {
      console.error("The style target container can not be found.");
      return;
    }

    this.styleContainer.innerHTML = finalHtml;
  }

  private getContrastColor(hexcolor: string) {
    const color = new Color(hexcolor);

    if (color.isLight()) {
      return "#000000";
    } else {
      return "#FFFFFF";
    }
  }

  private lightenColor(hexcolor: string) {
    const color = new Color(hexcolor);
    return color.lighten(0.9).hex();
  }

  private darkenColor(hexcolor: string) {
    const color = new Color(hexcolor);
    return color.darken(0.4).hex();
  }

  private updateSettingsFormField(name: string, value: any) {
    if (!this.settingsForm) {
      return;
    }

    var input = this.settingsForm.querySelector<HTMLInputElement>('[name="' + name + '"]');

    if (!input) {
      return;
    }

    input.value = value;
  }

  private getFormValue() {
    if (!this.settingsForm) {
      return;
    }

    var data: { [key: string]: any } = {};

    var formData = new FormData(this.settingsForm);

    for (const key of formData.keys()) {
      data[key] = formData.get(key);
    }

    // When a checkbox is disabled, it is not part of the FormData
    // So lets process the checkboxes before
    const checkboxes = this.settingsForm.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');

    checkboxes.forEach((checkbox) => {
      const name = checkbox.getAttribute("name");

      if (!name) {
        return;
      }

      data[name] = checkbox.checked;
    });

    return data;
  }
}

new RecipeCreatorAdminSettings();
