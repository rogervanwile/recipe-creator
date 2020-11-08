import { __ } from "@wordpress/i18n";

import {
  TextControl,
  PanelBody,
  PanelRow,
  SelectControl,
  CheckboxControl,
  __experimentalInputControl as InputControl,
  __experimentalRadio as Radio,
  __experimentalRadioGroup as RadioGroup,
} from "@wordpress/components";

import {
  MediaUpload,
  MediaUploadCheck,
  RichText,
  InspectorControls,
} from "@wordpress/block-editor";

import { Fragment } from "@wordpress/element";

import "./editor.scss";

var recipeManagerProMigrationDone = false;

export default function Edit(props) {
  // Workaround for https://github.com/WordPress/gutenberg/issues/7342
  if (!recipeManagerProMigrationDone) {
    const cleanedDefaultData = {};

    Object.keys(props.attributes).forEach((key) => {
      if (
        typeof props.attributes[key] === "string" &&
        props.attributes[key].indexOf("::STORE_DEFAULT_VALUE_HACK") !== -1
      ) {
        cleanedDefaultData[key] = props.attributes[key].replace(
          "::STORE_DEFAULT_VALUE_HACK",
          ""
        );
      } else if (
        typeof props.attributes[key] === "string" &&
        props.attributes[key].indexOf("::STORE_DEFAULT_VALUE_NUMBER_HACK") !==
          -1
      ) {
        cleanedDefaultData[key] = parseInt(
          props.attributes[key].replace(
            "::STORE_DEFAULT_VALUE_NUMBER_HACK",
            ""
          ),
          10
        );
      } else {
        cleanedDefaultData[key] = props.attributes[key];
      }
    });

    recipeManagerProMigrationDone = true;

    props.setAttributes(cleanedDefaultData);
  }

  if (props.attributes.servings) {
    if (!props.attributes.recipeYield) {
      props.setAttributes({
        recipeYield: props.attributes.servings,
        recipeYieldUnit: "servings",
        servings: "",
      });
    } else {
      props.setAttributes({ servings: "", recipeYieldUnit: "piece" });
    }
  }

  if (props.attributes.recipeYield && !props.attributes.recipeYieldUnit) {
    props.setAttributes({ recipeYieldUnit: "piece" });
  }

  const ALLOWED_MEDIA_TYPES = ["image"];

  const categoryOptions = [
    __("Breakfast", "recipe-manager-pro"),
    __("Bread", "recipe-manager-pro"),
    __("Appetizers & Snacks", "recipe-manager-pro"),
    __("Salads", "recipe-manager-pro"),
    __("Soups & Stews", "recipe-manager-pro"),
    __("Main Dishes", "recipe-manager-pro"),
    __("Side Dishes", "recipe-manager-pro"),
    __("Desserts", "recipe-manager-pro"),
    __("Drinks", "recipe-manager-pro"),
    __("Sweets", "recipe-manager-pro"),
  ].map((value) => {
    return { label: value, value: value };
  });

  categoryOptions.unshift({
    value: null,
    label: __("Select a category", "recipe-manager-pro"),
    disabled: true,
  });

  const recipeYieldUnitOptions = [
    {
      value: "servings",
      label: __("servings", "recipe-manager-pro"),
    },
    {
      value: "piece",
      label: __("piece", "recipe-manager-pro"),
    },
  ];

  function updateTime(settingKey, value, update = {}) {
    let prepTime = parseInt(props.attributes.prepTime, 10) || 0;
    let restTime = parseInt(props.attributes.restTime, 10) || 0;
    let cookTime = parseInt(props.attributes.cookTime, 10) || 0;

    const intValue = parseInt(value, 10);

    if (!isNaN(intValue)) {
      switch (settingKey) {
        case "prepTime":
          prepTime = intValue;
          update["prepTime"] = "" + prepTime;
          break;
        case "restTime":
          restTime = intValue;
          update["restTime"] = "" + restTime;
          break;
        case "cookTime":
          cookTime = intValue;
          update["cookTime"] = "" + cookTime;
          break;
      }

      update["totalTime"] = "" + (prepTime + restTime + cookTime);

      props.setAttributes(update);
    }
  }

  function getRatedStarsWidth(averageRating) {
    if (averageRating) {
      return (65 / 5) * averageRating;
    } else {
      return 0;
    }
  }

  function getRatingElement() {
    if (props.data.meta.rating_count) {
      return (
        <div className="features-snipped-preview--rating">
          {props.data.meta.average_rating}&nbsp;
          <span className="features-snipped-preview--stars">
            <span
              className="features-snipped-preview--stars--rated"
              style={{
                width:
                  getRatedStarsWidth(props.data.meta.average_rating) + "px",
              }}
            ></span>
          </span>
          &nbsp;({props.data.meta.rating_count})
        </div>
      );
    } else {
      return (
        <div className="features-snipped-preview--rating">
          {__("No reviews", "recipe-manager-pro")}
        </div>
      );
    }
  }

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody title={__("Settings", "recipe-manager-pro")}>
          <PanelRow>
            <h3>{__("Timings", "recipe-manager-pro")}</h3>
          </PanelRow>
          <PanelRow>
            <CheckboxControl
              checked={props.attributes.showPrepTime}
              label={__("Show prep time", "recipe-manager-pro")}
              onChange={(showPrepTime) => {
                updateTime("prepTime", 0, { showPrepTime });
              }}
            />
          </PanelRow>
          <PanelRow>
            <CheckboxControl
              checked={props.attributes.showRestTime}
              label={__("Show prep time", "recipe-manager-pro")}
              onChange={(showRestTime) => {
                updateTime("restTime", 0, { showRestTime });
              }}
            />
          </PanelRow>
          <PanelRow>
            <CheckboxControl
              checked={props.attributes.showCookTime}
              label={__("Show prep time", "recipe-manager-pro")}
              onChange={(showCookTime) => {
                updateTime("cookTime", 0, { showCookTime });
              }}
            />
          </PanelRow>
        </PanelBody>
      </InspectorControls>
      <div className={"recipe-manager-pro--block " + props.className}>
        <RichText
          tagName="h2"
          value={props.attributes.name}
          placeholder={__("Title of your recipe", "recipe-manager-pro")}
          onChange={(name) => {
            props.setAttributes({ name });
          }}
        />
        <div className="recipe-manager-pro--block--intro">
          <div>
            <RadioGroup
              onChange={(difficulty) => props.setAttributes({ difficulty })}
              checked={props.attributes.difficulty}
            >
              <Radio value="simple">{__("simple", "recipe-manager-pro")}</Radio>
              <Radio value="moderate">
                {__("moderate", "recipe-manager-pro")}
              </Radio>
              <Radio value="challenging">
                {__("challenging", "recipe-manager-pro")}
              </Radio>
            </RadioGroup>

            <RichText
              tagName="p"
              value={props.attributes.description}
              placeholder={__(
                "Short description of your recipe",
                "recipe-manager-pro"
              )}
              onChange={(description) => {
                props.setAttributes({ description });
              }}
            />
          </div>
          <div>
            <MediaUploadCheck>
              <MediaUpload
                onSelect={(media) => {
                  if (media) {
                    props.setAttributes({ image4_3: media.url });
                  }
                }}
                allowedTypes={ALLOWED_MEDIA_TYPES}
                value={props.attributes.image4_3}
                render={({ open }) => (
                  <div
                    className="recipe-manager-pro--block--main-image"
                    style={{
                      backgroundImage: "url(" + props.attributes.image4_3 + ")",
                    }}
                    onClick={open}
                  ></div>
                )}
              />
            </MediaUploadCheck>
          </div>
        </div>
        <hr />
        <div className="recipe-manager-pro--block--timing-list">
          <ul>
            {(() => {
              return props.attributes.showPrepTime ? (
                <li>
                  <header>{__("Prep time", "recipe-manager-pro")}:</header>
                  <span>
                    <InputControl
                      type="number"
                      min="0"
                      value={props.attributes.prepTime}
                      placeholder="0"
                      onChange={(prepTime) => {
                        updateTime("prepTime", prepTime);
                      }}
                      suffix={__("Minutes", "recipe-manager-pro")}
                    />
                  </span>
                </li>
              ) : null;
            })()}

            {(() => {
              return props.attributes.showRestTime ? (
                <li>
                  <header>{__("Rest time", "recipe-manager-pro")}:</header>
                  <span>
                    <InputControl
                      type="number"
                      min="0"
                      value={props.attributes.restTime}
                      placeholder="0"
                      onChange={(restTime) => {
                        updateTime("restTime", restTime);
                      }}
                      suffix={__("Minutes", "recipe-manager-pro")}
                    />
                  </span>
                </li>
              ) : null;
            })()}

            {(() => {
              return props.attributes.showCookTime ? (
                <li>
                  <header>{__("Cook time", "recipe-manager-pro")}:</header>
                  <span>
                    <InputControl
                      type="number"
                      min="0"
                      value={props.attributes.cookTime}
                      placeholder="0"
                      onChange={(cookTime) => {
                        updateTime("cookTime", cookTime);
                      }}
                      suffix={__("Minutes", "recipe-manager-pro")}
                    />
                  </span>
                </li>
              ) : null;
            })()}

            <li>
              <header>{__("Total time", "recipe-manager-pro")}:</header>
              <span>
                {props.attributes.totalTime}{" "}
                {__("Minutes", "recipe-manager-pro")}
              </span>
            </li>
          </ul>
        </div>
        <hr />
        <div className="recipe-manager-pro--block--headline">
          <h3>{__("Ingredients", "recipe-manager-pro")}</h3>
        </div>
        <div className="recipe-manager-pro--block--flex-container">
          <TextControl
            label={__("Results in", "recipe-manager-pro")}
            type="number"
            min="0"
            value={props.attributes.recipeYield}
            placeholder="0"
            onChange={(recipeYield) => {
              props.setAttributes({ recipeYield });
            }}
          />

          <SelectControl
            label={__("Unit", "recipe-manager-pro")}
            value={props.attributes.recipeYieldUnit}
            options={recipeYieldUnitOptions}
            onChange={(recipeYieldUnit) =>
              props.setAttributes({ recipeYieldUnit })
            }
          />
        </div>

        <RichText
          tagName="ul"
          multiline="li"
          className="recipe-manager-pro--block--ingredients"
          placeholder={__("Add the ingredients here...", "recipe-manager-pro")}
          value={props.attributes.ingredients}
          onChange={(ingredients) => props.setAttributes({ ingredients })}
        />

        <div className="recipe-manager-pro--block--headline">
          <h3>{__("Steps of preparation", "recipe-manager-pro")}</h3>
        </div>

        <RichText
          tagName="ol"
          multiline="li"
          className="recipe-manager-pro--block--preparation-steps"
          placeholder={__(
            "Add the steps of preparation here...",
            "recipe-manager-pro"
          )}
          value={props.attributes.preparationSteps}
          onChange={(preparationSteps) =>
            props.setAttributes({ preparationSteps })
          }
        />

        <hr />

        <div className="recipe-manager-pro--block--headline">
          <h3>{__("Notes", "recipe-manager-pro")}</h3>
        </div>

        <RichText
          tagName="p"
          value={props.attributes.notes}
          placeholder={__("Additional notes ...", "recipe-manager-pro")}
          onChange={(notes) => {
            props.setAttributes({ notes });
          }}
        />

        <section>
          <div className="recipe-manager-pro--block--headline">
            <h3>{__("Video", "recipe-manager-pro")}</h3>
          </div>
          <TextControl
            label={__("Video-URL", "recipe-manager-pro")}
            value={props.attributes.videoUrl}
            type="number"
            onChange={(videoUrl) => props.setAttributes({ videoUrl })}
          />
        </section>

        <section className="seo-section">
          <div className="recipe-manager-pro--block--headline">
            <h3>{__("SEO", "recipe-manager-pro")}</h3>
          </div>

          <p>
            {__(
              "Google and other search enginges needs some more informations to process your recipe. These informations are not visible to your user, but will have impact on the ranking of your recipe in search engines. So we recommend to provide all these informations.",
              "recipe-manager-pro"
            )}
          </p>

          <div className="recipe-manager-pro--block--flex-container">
            <TextControl
              label={__("Cuisine", "recipe-manager-pro")}
              value={props.attributes.recipeCuisine}
              placeholder={__(
                'e.g. "Italian" or "German"',
                "recipe-manager-pro"
              )}
              onChange={(recipeCuisine) => {
                props.setAttributes({ recipeCuisine });
              }}
            />

            <SelectControl
              label={__("Category", "recipe-manager-pro")}
              value={props.attributes.recipeCategory}
              options={categoryOptions}
              onChange={(recipeCategory) =>
                props.setAttributes({ recipeCategory })
              }
            />

            <TextControl
              label={__("Keywords", "recipe-manager-pro")}
              value={props.attributes.keywords}
              placeholder={__("quick & easy, vegetarian", "recipe-manager-pro")}
              onChange={(keywords) => {
                props.setAttributes({ keywords });
              }}
            />
          </div>

          <div>
            <h4>{__("Picture of the finished dish", "recipe-manager-pro")}</h4>
            <p>
              {__(
                "You should add 3 pictures in different aspect ratios to this recipe to have a change for a more prominent display in the Google search results. The 16:9 or sometimes the 4:3 aspect ratio is used for the featured snipped. If you provide a square image, Google sometimes display it in your search result.",
                "recipe-manager-pro"
              )}
            </p>
          </div>

          <MediaUploadCheck>
            <MediaUpload
              onSelect={(media) => {
                if (media) {
                  props.setAttributes({ image1_1: media.url });
                }
              }}
              allowedTypes={ALLOWED_MEDIA_TYPES}
              value={props.attributes.image1_1}
              render={({ open }) => (
                <div
                  className="image-preview image-preview-1-1"
                  style={{
                    backgroundImage: "url(" + props.attributes.image1_1 + ")",
                  }}
                  onClick={open}
                >
                  {!props.attributes.image1_1 ? (
                    <span className="aspect-ratio">1:1</span>
                  ) : (
                    ""
                  )}
                </div>
              )}
            />
          </MediaUploadCheck>

          <MediaUploadCheck>
            <MediaUpload
              onSelect={(media) => {
                if (media) {
                  props.setAttributes({ image4_3: media.url });
                }
              }}
              allowedTypes={ALLOWED_MEDIA_TYPES}
              value={props.attributes.image4_3}
              render={({ open }) => (
                <div
                  className="image-preview image-preview-4-3"
                  style={{
                    backgroundImage: "url(" + props.attributes.image4_3 + ")",
                  }}
                  onClick={open}
                >
                  {!props.attributes.image4_3 ? (
                    <span className="aspect-ratio">4:3</span>
                  ) : (
                    ""
                  )}
                </div>
              )}
            />
          </MediaUploadCheck>

          <MediaUploadCheck>
            <MediaUpload
              onSelect={(media) => {
                if (media) {
                  props.setAttributes({ image16_9: media.url });
                }
              }}
              allowedTypes={ALLOWED_MEDIA_TYPES}
              value={props.attributes.image16_9}
              render={({ open }) => (
                <div
                  className="image-preview image-preview-16-9"
                  style={{
                    backgroundImage: "url(" + props.attributes.image16_9 + ")",
                  }}
                  onClick={open}
                >
                  {!props.attributes.image16_9 ? (
                    <span className="aspect-ratio">16:9</span>
                  ) : (
                    ""
                  )}
                </div>
              )}
            />
          </MediaUploadCheck>

          <h5>{__("Previews", "recipe-manager-pro")}</h5>

          <section className="features-snipped-preview">
            <MediaUploadCheck>
              <MediaUpload
                onSelect={(media) => {
                  if (media) {
                    props.setAttributes({ image4_3: media.url });
                  }
                }}
                allowedTypes={ALLOWED_MEDIA_TYPES}
                value={props.attributes.image4_3}
                render={({ open }) => (
                  <div
                    className="features-snipped-preview--image-wrapper features-snipped-preview--43"
                    onClick={open}
                  >
                    <div
                      className="features-snipped-preview--image"
                      style={{
                        backgroundImage:
                          "url(" + props.attributes.image4_3 + ")",
                      }}
                    ></div>
                  </div>
                )}
              />
            </MediaUploadCheck>
            <div className="features-snipped-preview--title">
              {props.attributes.name}
            </div>
            <div className="features-snipped-preview--blog-title">
              {props.data.title}
            </div>

            {getRatingElement()}
            <div className="features-snipped-preview--total-time">
              {props.attributes.totalTime} Min.
            </div>
          </section>

          <section className="features-snipped-preview">
            <MediaUploadCheck>
              <MediaUpload
                onSelect={(media) => {
                  if (media) {
                    props.setAttributes({ image16_9: media.url });
                  }
                }}
                allowedTypes={ALLOWED_MEDIA_TYPES}
                value={props.attributes.image16_9}
                render={({ open }) => (
                  <div
                    className="features-snipped-preview--image-wrapper"
                    onClick={open}
                  >
                    <div
                      className="features-snipped-preview--image"
                      style={{
                        backgroundImage:
                          "url(" + props.attributes.image16_9 + ")",
                      }}
                    ></div>
                  </div>
                )}
              />
            </MediaUploadCheck>
            <div className="features-snipped-preview--title">
              {props.attributes.name}
            </div>
            <div className="features-snipped-preview--blog-title">
              {props.data.title}
            </div>
            {getRatingElement()}
            <div className="features-snipped-preview--total-time">
              {props.attributes.totalTime} Min.
            </div>
          </section>
          <div>
            <section className="features-result-preview">
              <h3 className="features-result-preview--headline">
                {props.attributes.name}
              </h3>
              <div className="features-result-preview--image-text">
                <MediaUploadCheck>
                  <MediaUpload
                    onSelect={(media) => {
                      if (media) {
                        props.setAttributes({ image1_1: media.url });
                      }
                    }}
                    allowedTypes={ALLOWED_MEDIA_TYPES}
                    value={props.attributes.image1_1}
                    render={({ open }) => (
                      <div
                        className="features-result-preview--image"
                        onClick={open}
                        style={{
                          backgroundImage:
                            "url(" + props.attributes.image1_1 + ")",
                        }}
                      ></div>
                    )}
                  ></MediaUpload>
                </MediaUploadCheck>
                <div className="features-result-preview--text">
                  <div className="features-result-preview--extract">
                    <span className="features-result-preview--date">
                      {props.data.publishDate} —
                    </span>
                    &nbsp;Lorem ipsum dolor sit amet, consectetur adipiscing
                    elit. Morbi nec lectus gravida, sollicitudin velit sed,
                    consectetur quam.
                  </div>

                  <div className="features-result-preview--meta">
                    <span className="features-snipped-preview--stars">
                      <span
                        className="features-snipped-preview--stars--rated"
                        style={{
                          width:
                            getRatedStarsWidth(props.data.meta.average_rating) +
                            "px",
                        }}
                      ></span>
                    </span>
                    <span>
                      &nbsp;{__("Rating", "recipe-manager-pro")}:{" "}
                      {props.data.meta.average_rating}
                    </span>{" "}
                    · &lrm;
                    <span>
                      {props.data.meta.rating_count}{" "}
                      {__("reviews", "recipe-manager-pro")}
                    </span>{" "}
                    · &lrm;
                    <span>{props.attributes.totalTime} Min.</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </Fragment>
  );
}
