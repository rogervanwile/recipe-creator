(function ($) {
  var AdminSettings = function () {
    var styleContainer = null;

    var styleBlockTemplate = null;

    var styleBlockTemplateString = null;

    var settingsForm = null;

    var construct = function () {
      initColorPicker();
      initOtherPicker();
    };

    var initColorPicker = function () {
      $(".foodblogkitchen-toolkit--color-picker").each(function () {
        var defaultValue = $(this).attr("data-default-value") || null;
        $(this).wpColorPicker({
          defaultColor: defaultValue,
          change: function (event, ui) {
            var data = {};
            data[event.target.name] = ui.color.toCSS();
            refreshStyles(data);
          },
        });
      });
    };

    var initOtherPicker = function () {
      $('input[type="number"],input[type="checkbox"]').each(function () {
        $(this).on("change", function () {
          refreshStyles();
        });
      });
    };

    // https://stackoverflow.com/a/13542669
    var calcColor = function (p, c0, c1, l) {
      let r,
        g,
        b,
        P,
        f,
        t,
        h,
        i = parseInt,
        m = Math.round,
        a = typeof c1 == "string";
      if (
        typeof p != "number" ||
        p < -1 ||
        p > 1 ||
        typeof c0 != "string" ||
        (c0[0] != "r" && c0[0] != "#") ||
        (c1 && !a)
      )
        return null;
      if (!this.pSBCr)
        this.pSBCr = (d) => {
          let n = d.length,
            x = {};
          if (n > 9) {
            ([r, g, b, a] = d = d.split(",")), (n = d.length);
            if (n < 3 || n > 4) return null;
            (x.r = i(r[3] == "a" ? r.slice(5) : r.slice(4))),
              (x.g = i(g)),
              (x.b = i(b)),
              (x.a = a ? parseFloat(a) : -1);
          } else {
            if (n == 8 || n == 6 || n < 4) return null;
            if (n < 6)
              d =
                "#" +
                d[1] +
                d[1] +
                d[2] +
                d[2] +
                d[3] +
                d[3] +
                (n > 4 ? d[4] + d[4] : "");
            d = i(d.slice(1), 16);
            if (n == 9 || n == 5)
              (x.r = (d >> 24) & 255),
                (x.g = (d >> 16) & 255),
                (x.b = (d >> 8) & 255),
                (x.a = m((d & 255) / 0.255) / 1000);
            else
              (x.r = d >> 16),
                (x.g = (d >> 8) & 255),
                (x.b = d & 255),
                (x.a = -1);
          }
          return x;
        };
      (h = c0.length > 9),
        (h = a ? (c1.length > 9 ? true : c1 == "c" ? !h : false) : h),
        (f = this.pSBCr(c0)),
        (P = p < 0),
        (t =
          c1 && c1 != "c"
            ? this.pSBCr(c1)
            : P
              ? { r: 0, g: 0, b: 0, a: -1 }
              : { r: 255, g: 255, b: 255, a: -1 }),
        (p = P ? p * -1 : p),
        (P = 1 - p);
      if (!f || !t) return null;
      if (l)
        (r = m(P * f.r + p * t.r)),
          (g = m(P * f.g + p * t.g)),
          (b = m(P * f.b + p * t.b));
      else
        (r = m((P * f.r ** 2 + p * t.r ** 2) ** 0.5)),
          (g = m((P * f.g ** 2 + p * t.g ** 2) ** 0.5)),
          (b = m((P * f.b ** 2 + p * t.b ** 2) ** 0.5));
      (a = f.a),
        (t = t.a),
        (f = a >= 0 || t >= 0),
        (a = f ? (a < 0 ? t : t < 0 ? a : a * P + t * p) : 0);
      if (h)
        return (
          "rgb" +
          (f ? "a(" : "(") +
          r +
          "," +
          g +
          "," +
          b +
          (f ? "," + m(a * 1000) / 1000 : "") +
          ")"
        );
      else
        return (
          "#" +
          (
            4294967296 +
            r * 16777216 +
            g * 65536 +
            b * 256 +
            (f ? m(a * 255) : 0)
          )
            .toString(16)
            .slice(1, f ? undefined : -2)
        );
    };

    var getContrastColor = function (hexcolor) {
      hexcolor = hexcolor.replace("#", "");
      var r = parseInt(hexcolor.substr(0, 2), 16);
      var g = parseInt(hexcolor.substr(2, 2), 16);
      var b = parseInt(hexcolor.substr(4, 2), 16);
      var yiq = (r * 299 + g * 587 + b * 114) / 1000;
      return yiq >= 128 ? "black" : "white";
    };

    var refreshStyles = function (update) {
      update = update || {};

      if (!styleBlockTemplate) {
        try {
          var templateElement = document.getElementById(
            "foodblogkitchen-toolkit--style-block-template"
          );

          if (templateElement) {
            styleBlockTemplateString = templateElement.innerText;
            Handlebars.registerHelper("encode", function (text) {
              return encodeURIComponent(text);
            });
            Handlebars.registerHelper("shade", function (color, shade) {
              // https://stackoverflow.com/a/13532993
              var R = parseInt(color.substring(1, 3), 16);
              var G = parseInt(color.substring(3, 5), 16);
              var B = parseInt(color.substring(5, 7), 16);

              R = parseInt((R * (100 + shade)) / 100);
              G = parseInt((G * (100 + shade)) / 100);
              B = parseInt((B * (100 + shade)) / 100);

              R = R < 255 ? R : 255;
              G = G < 255 ? G : 255;
              B = B < 255 ? B : 255;

              var RR =
                R.toString(16).length == 1
                  ? "0" + R.toString(16)
                  : R.toString(16);
              var GG =
                G.toString(16).length == 1
                  ? "0" + G.toString(16)
                  : G.toString(16);
              var BB =
                B.toString(16).length == 1
                  ? "0" + B.toString(16)
                  : B.toString(16);

              return "#" + RR + GG + BB;
            });

            styleBlockTemplate = Handlebars.compile(styleBlockTemplateString);
          }
        } catch (e) {
          console.error(e);
        }
      }

      if (!styleBlockTemplate) {
        console.error("The style block template can not be generated.");
        return;
      }

      var data = {
        ...getFormValue(),
        ...update,
      };

      // Migrate the form to the needed data structure
      migratedData = {};

      Object.keys(data).map((key) => {
        switch (key) {
          case "foodblogkitchen_toolkit__primary_color":
            migratedData["primaryColor"] = data[key];
            migratedData["primaryColorContrast"] = getContrastColor(data[key]);
            migratedData["primaryColorLight"] = calcColor(0.9, data[key]);
            migratedData["primaryColorLightContrast"] = getContrastColor(
              migratedData["primaryColorLight"]
            );
            migratedData["primaryColorDark"] = calcColor(-0.4, data[key]);

            updateSettingsFormField(
              "foodblogkitchen_toolkit__primary_color_contrast",
              migratedData["primaryColorContrast"]
            );
            updateSettingsFormField(
              "foodblogkitchen_toolkit__primary_color_light",
              migratedData["primaryColorLight"]
            );
            updateSettingsFormField(
              "foodblogkitchen_toolkit__primary_color_light_contrast",
              migratedData["primaryColorLightContrast"]
            );
            updateSettingsFormField(
              "foodblogkitchen_toolkit__primary_color_dark",
              migratedData["primaryColorDark"]
            );
            break;
          case "foodblogkitchen_toolkit__secondary_color":
            migratedData["secondaryColor"] = data[key];
            migratedData["secondaryColorContrast"] = getContrastColor(
              data[key]
            );

            updateSettingsFormField(
              "foodblogkitchen_toolkit__secondary_color_contrast",
              migratedData["secondaryColorContrast"]
            );
            break;
          case "foodblogkitchen_toolkit__background_color":
            migratedData["backgroundColor"] = data[key];
            migratedData["backgroundColorContrast"] = getContrastColor(
              data[key]
            );

            updateSettingsFormField(
              "foodblogkitchen_toolkit__background_color_contrast",
              migratedData["backgroundColorContrast"]
            );
            break;
          case "foodblogkitchen_toolkit__show_border":
            migratedData["showBorder"] = data[key];
            break;
          case "foodblogkitchen_toolkit__show_box_shadow":
            migratedData["showBoxShadow"] = data[key];
            break;
          case "foodblogkitchen_toolkit__border_radius":
            migratedData["borderRadius"] = data[key];
            break;
          // case "foodblogkitchen_toolkit__primary_color_light":
          //   migratedData["primaryColorLight"] = data[key];
          //   break;
          // case "foodblogkitchen_toolkit__primary_color_dark":
          //   migratedData["primaryColorDark"] = data[key];
          //   break;
        }
      });

      var finalHtml = styleBlockTemplate({ options: migratedData });

      if (!styleContainer) {
        styleContainer = document.getElementById(
          "foodblogkitchen-toolkit--style-container"
        );
      }

      if (!styleContainer) {
        console.error("The style target container can not be found.");
        return;
      }

      styleContainer.innerHTML = finalHtml;
    };

    var updateSettingsFormField = function (name, value) {
      if (!settingsForm) {
        settingsForm = document.getElementById(
          "foodblogkitchen-toolkit--settings-form"
        );
      }

      if (!settingsForm) {
        console.error("The settings form can not be found.");
        return;
      }

      var input = settingsForm.querySelector('[name="' + name + '"]');

      if (input) {
        input.value = value;
      }
    };

    var getFormValue = function () {
      if (!settingsForm) {
        settingsForm = document.getElementById(
          "foodblogkitchen-toolkit--settings-form"
        );
      }

      if (!settingsForm) {
        console.error("The settings form can not be found.");
        return;
      }

      var data = {};

      var formData = new FormData(settingsForm);
      for (var key of formData.keys()) {
        data[key] = formData.get(key);
      }

      // When a checkbox is disabled, it is not part of the FormData
      // So lets process the checkboxes before

      const checkboxes = settingsForm.querySelectorAll(
        'input[type="checkbox"]'
      );

      checkboxes.forEach((checkbox) => {
        data[checkbox.getAttribute("name")] = checkbox.checked;
      });

      return data;
    };

    construct();

    return self;
  };

  $(function () {
    new AdminSettings();
  });
})(jQuery);
