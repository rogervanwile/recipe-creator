import Color from "color";

const styleBlockTemplate = require("../blocks/block/style-block.hbs");

import "../styles/admin.scss";

class AdminSettings {
  private styleContainer: HTMLElement | null = null;

  private styleBlockTemplate = styleBlockTemplate;

  private settingsForm: HTMLFormElement;

  constructor() {
    this.initColorPicker();
    this.initOtherPicker();

    this.settingsForm = document.getElementById(
      "recipe-plugin-for-wp--settings-form"
    ) as HTMLFormElement;
  }

  private initColorPicker() {
    const colorPickers = document.querySelectorAll(
      ".recipe-plugin-for-wp--color-picker"
    );
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
    const adminForm = document.querySelector<HTMLElement>(
      ".recipe-plugin-for-wp--settings-form "
    );

    if (!adminForm) {
      return;
    }

    const inputs = adminForm.querySelectorAll<HTMLInputElement>(
      'input[type="number"],input[type="checkbox"]'
    );

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

    // Migrate the form to the needed data structure
    const migratedData: { [key: string]: any } = {};

    Object.keys(data).map((key) => {
      switch (key) {
        case "recipe_plugin_for_wp__primary_color":
          migratedData["primaryColor"] = data[key];
          migratedData["primaryColorContrast"] = this.getContrastColor(
            data[key]
          );
          migratedData["primaryColorLight"] = this.lightenColor(data[key]);
          migratedData["primaryColorLightContrast"] = this.getContrastColor(
            migratedData["primaryColorLight"]
          );
          migratedData["primaryColorDark"] = this.darkenColor(data[key]);

          this.updateSettingsFormField(
            "recipe_plugin_for_wp__primary_color_contrast",
            migratedData["primaryColorContrast"]
          );
          this.updateSettingsFormField(
            "recipe_plugin_for_wp__primary_color_light",
            migratedData["primaryColorLight"]
          );
          this.updateSettingsFormField(
            "recipe_plugin_for_wp__primary_color_light_contrast",
            migratedData["primaryColorLightContrast"]
          );
          this.updateSettingsFormField(
            "recipe_plugin_for_wp__primary_color_dark",
            migratedData["primaryColorDark"]
          );
          break;
        case "recipe_plugin_for_wp__secondary_color":
          migratedData["secondaryColor"] = data[key];
          migratedData["secondaryColorContrast"] = this.getContrastColor(
            data[key]
          );

          this.updateSettingsFormField(
            "recipe_plugin_for_wp__secondary_color_contrast",
            migratedData["secondaryColorContrast"]
          );
          break;
        case "recipe_plugin_for_wp__background_color":
          migratedData["backgroundColor"] = data[key];
          migratedData["backgroundColorContrast"] = this.getContrastColor(
            data[key]
          );

          this.updateSettingsFormField(
            "recipe_plugin_for_wp__background_color_contrast",
            migratedData["backgroundColorContrast"]
          );
          break;
        case "recipe_plugin_for_wp__show_border":
          migratedData["showBorder"] = data[key];
          break;
        case "recipe_plugin_for_wp__show_box_shadow":
          migratedData["showBoxShadow"] = data[key];
          break;
        case "recipe_plugin_for_wp__border_radius":
          migratedData["borderRadius"] = data[key];
          break;
        // case "recipe_plugin_for_wp__primary_color_light":
        //   migratedData["primaryColorLight"] = data[key];
        //   break;
        // case "recipe_plugin_for_wp__primary_color_dark":
        //   migratedData["primaryColorDark"] = data[key];
        //   break;
      }
    });

    var finalHtml = this.styleBlockTemplate({ options: migratedData });

    if (!this.styleContainer) {
      this.styleContainer = document.getElementById(
        "recipe-plugin-for-wp--style-container"
      );
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
      console.error("The settings form can not be found.");
      return;
    }

    var input = this.settingsForm.querySelector<HTMLInputElement>(
      '[name="' + name + '"]'
    );

    if (!input) {
      return;
    }

    input.value = value;
  }

  private getFormValue() {
    if (!this.settingsForm) {
      console.error("The settings form can not be found.");
      return;
    }

    var data: { [key: string]: any } = {};

    var formData = new FormData(this.settingsForm);

    for (const key of formData.keys()) {
      data[key] = formData.get(key);
    }

    // When a checkbox is disabled, it is not part of the FormData
    // So lets process the checkboxes before

    const checkboxes = this.settingsForm.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]'
    );

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

new AdminSettings();
