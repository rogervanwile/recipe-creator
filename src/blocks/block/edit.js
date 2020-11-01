/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";

import {
  TextControl,
  TextareaControl,
  SelectControl,
  Button,
  // RadioGroup,
  // Radio
} from "@wordpress/components";

import {
  __experimentalRadio as Radio,
  __experimentalRadioGroup as RadioGroup,
} from "@wordpress/components";

import {
  MediaUpload,
  MediaUploadCheck,
  RichText,
  InspectorControls,
} from "@wordpress/block-editor";

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./editor.scss";

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @param {Object} [props]           Properties passed from the editor.
 * @param {string} [props.className] Class name generated for the block.
 *
 * @return {WPElement} Element to render.
 */

var recipeManagerProMigrationDone = false;

export default function Edit(props) {
  // Workaround for https://github.com/WordPress/gutenberg/issues/7342
  if (!recipeManagerProMigrationDone) {
    const cleanedDefaultData = {};

    Object.keys(props.attributes).forEach((key) => {
      cleanedDefaultData[key] = props.attributes[key].replace(
        "::STORE_DEFAULT_VALUE_HACK",
        ""
      );
    });

    props.setAttributes(cleanedDefaultData);
    recipeManagerProMigrationDone = true;
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

  function updateTime(settingKey, value) {
    let prepTime = parseInt(props.attributes.prepTime, 10) || 0;
    let restTime = parseInt(props.attributes.restTime, 10) || 0;
    let cookTime = parseInt(props.attributes.cookTime, 10) || 0;

    const update = {};

    switch (settingKey) {
      case "prepTime":
        prepTime = parseInt(value, 10);
        update["prepTime"] = prepTime;
        break;
      case "restTime":
        restTime = parseInt(value, 10);
        update["restTime"] = restTime;
        break;
      case "cookTime":
        cookTime = parseInt(value, 10);
        update["cookTime"] = cookTime;
        break;
    }

    update["totalTime"] = prepTime + restTime + cookTime;

    props.setAttributes(update);
  }

  return (
    <div className={props.className}>
      <div>
        <div className="container">
          <div className="row">
            <div className="col-6">
              <RichText
                tagName="h2"
                value={props.attributes.name}
                placeholder={__(
                  "Title of your recipe",
                  "kantina-delicacy-plugin"
                )}
                onChange={(name) => {
                  props.setAttributes({ name });
                }}
              />

              <RichText
                tagName="p"
                value={props.attributes.description}
                placeholder={__(
                  "Short description of your recipe",
                  "kantina-delicacy-plugin"
                )}
                onChange={(description) => {
                  props.setAttributes({ description });
                }}
              />

              <div className="components-base-control__field">
                <label className="components-base-control__label">
                  {__("Difficulty", "kantina-delicacy-plugin")}
                </label>

                <RadioGroup
                  onChange={(difficulty) => props.setAttributes({ difficulty })}
                  checked={props.attributes.difficulty}
                >
                  <Radio value={__("Simple", "recipe-manager-pro")}>
                    {__("Simple", "recipe-manager-pro")}
                  </Radio>
                  <Radio value={__("Moderate", "kantina-delicacy-plugin")}>
                    {__("Moderate", "kantina-delicacy-plugin")}
                  </Radio>
                  <Radio value={__("Challenging", "kantina-delicacy-plugin")}>
                    {__("Challenging", "kantina-delicacy-plugin")}
                  </Radio>
                </RadioGroup>
              </div>
            </div>
            <div className="col-6">
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
                    <img
                      src={props.attributes.image4_3}
                      className="img-fluid mb-4 d-block mx-auto"
                      onClick={open}
                    />
                  )}
                />
              </MediaUploadCheck>
            </div>
          </div>
          <div className="row icon-row">
            <div className="col">
              <div className="meta-with-icon">
                <header>{__("Prep time", "kantina-delicacy-plugin")}</header>
                <img src="https://placehold.it/64x64" width="64" height="64" />
                <div>
                  <TextControl
                    type="number"
                    min="0"
                    value={props.attributes.prepTime}
                    placeholder={__("15", "kantina-delicacy-plugin")}
                    onChange={(prepTime) => {
                      updateTime("prepTime", prepTime);
                    }}
                  />
                  <span>{props.attributes.prepTimeUnit}</span>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="meta-with-icon">
                <header>{__("Rest time", "kantina-delicacy-plugin")}</header>
                <img src="https://placehold.it/64x64" width="64" height="64" />
                <div>
                  <TextControl
                    type="number"
                    min="0"
                    value={props.attributes.restTime}
                    placeholder={__("15", "kantina-delicacy-plugin")}
                    onChange={(restTime) => {
                      updateTime("restTime", restTime);
                    }}
                  />
                  <span>{props.attributes.restTimeUnit}</span>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="meta-with-icon">
                <header>{__("Cook time", "kantina-delicacy-plugin")}</header>
                <img src="https://placehold.it/64x64" width="64" height="64" />
                <div>
                  <TextControl
                    type="number"
                    min="0"
                    value={props.attributes.cookTime}
                    placeholder={__("15", "kantina-delicacy-plugin")}
                    onChange={(cookTime) => {
                      updateTime("cookTime", cookTime);
                    }}
                  />{" "}
                  <span>{props.attributes.cookTimeUnit}</span>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="meta-with-icon">
                <header>{__("Total time", "kantina-delicacy-plugin")}</header>
                <img src="https://placehold.it/64x64" width="64" height="64" />
                <div>
                  <span>{props.attributes.totalTime}</span>&nbsp;
                  <span>{props.attributes.totalTimeUnit}</span>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="meta-with-icon">
                <header>{__("Yield", "kantina-delicacy-plugin")}</header>
                <img src="https://placehold.it/64x64" width="64" height="64" />
                <div>
                  <TextControl
                    type="number"
                    min="0"
                    value={props.attributes.recipeYield}
                    placeholder={__("4", "kantina-delicacy-plugin")}
                    onChange={(recipeYield) => {
                      props.setAttributes({ recipeYield });
                    }}
                  />{" "}
                  <span>{__("piece", "kantina-delicacy-plugin")}</span>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="meta-with-icon">
                <header>{__("Servings", "kantina-delicacy-plugin")}</header>
                <img src="https://placehold.it/64x64" width="64" height="64" />
                <div>
                  <TextControl
                    type="number"
                    min="0"
                    value={props.attributes.servings}
                    placeholder={__("4", "kantina-delicacy-plugin")}
                    onChange={(servings) => {
                      props.setAttributes({ servings });
                    }}
                  />{" "}
                  <span>{__("servings", "kantina-delicacy-plugin")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <h3>{__("Ingredients", "recipe-manager-pro")}</h3>

            <RichText
              tagName="ul"
              multiline="li"
              className="recipe-ingredients-list"
              placeholder={__(
                "Add the ingredients here...",
                "recipe-manager-pro"
              )}
              value={props.attributes.ingredients}
              onChange={(ingredients) => props.setAttributes({ ingredients })}
            />

            <h3>{__("Steps of preparation", "recipe-manager-pro")}</h3>
            <RichText
              tagName="ol"
              multiline="li"
              className="recipe-preparation-steps-list"
              placeholder={__(
                "Add the steps of preparation here...",
                "recipe-manager-pro"
              )}
              value={props.attributes.preparationSteps}
              onChange={(preparationSteps) =>
                props.setAttributes({ preparationSteps })
              }
            />
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col-12">
            <h3>{__("Notes", "kantina-delicacy-plugin")}</h3>

            <RichText
              tagName="p"
              value={props.attributes.notes}
              placeholder={__(
                "Additional notes ...",
                "kantina-delicacy-plugin"
              )}
              onChange={(notes) => {
                props.setAttributes({ notes });
              }}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <h3>Nutrition</h3>

            <p>
              <em>
                {__(
                  "Please provide the incredients related to the given servings, so this plugin cna calculate the nutrion automatically.",
                  "recipe-manager-pro"
                )}
              </em>
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <h3>Video</h3>
          </div>
          <div className="col-12">
            <TextControl
              label={__("Video-URL", "recipe-manager-pro")}
              value={props.attributes.videoUrl}
              type="number"
              onChange={(videoUrl) => props.setAttributes({ videoUrl })}
            />
          </div>
        </div>

        <div className="row seo-section">
          <div className="col-12">
            <h3>{__("SEO", "recipe-manager-pro")}</h3>
            <p>
              {__(
                "Google and other search enginges needs some more informations to process your recipe. These informations are not visible to your user, but will have impact on the ranking of your recipe in search engines. So we recommend to provide all these informations.",
                "recipe-manager-pro"
              )}
            </p>
          </div>

          <div className="col-4">
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
          </div>
          <div className="col-4">
            <SelectControl
              label={__("Category", "recipe-manager-pro")}
              value={props.attributes.recipeCategorys}
              options={categoryOptions}
              onChange={(recipeCategory) =>
                props.setAttributes({ recipeCategory })
              }
            />
          </div>

          <div className="col-4">
            <TextControl
              label={__("Keywords", "recipe-manager-pro")}
              value={props.attributes.keywords}
              placeholder={__(
                "quick & easy, vegetarian",
                "kantina-delicacy-plugin"
              )}
              onChange={(keywords) => {
                props.setAttributes({ keywords });
              }}
            />
          </div>
          <div className="col-12">
            <h4>{__("Picture of the finished dish", "recipe-manager-pro")}</h4>
            <p>
              {__(
                "You should add 3 pictures in different aspect ratios to this recipe to have a change for a more prominent display in the Google search results. The 16:9 or sometimes the 4:3 aspect ratio is used for the featured snipped. If you provide a square image, Google sometimes display it in your search result.",
                "recipe-manager-pro"
              )}
            </p>
          </div>
          <div className="col-12">
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
                      backgroundImage:
                        "url(" + props.attributes.image16_9 + ")",
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
          </div>
          <div className="col-12">
            <div className="seo-preview">
              <div className="row">
                <div className="col-12">
                  <h5>{__("Previews", "recipe-manager-pro")}</h5>
                </div>
                <div className="col-12">
                  {/* <h4>16:9</h4> */}
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
                      Titel des Blogs
                    </div>
                    <div className="features-snipped-preview--rating">
                      4,7
                      <span className="features-snipped-preview--stars"></span>
                      (199)
                    </div>
                    <div className="features-snipped-preview--total-time">
                      30 Min.
                    </div>
                  </section>
                  {/* </div>
          <div className="col-4"> */}
                  {/* <h4>4:3</h4> */}
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
                      Titel des Blogs
                    </div>
                    <div className="features-snipped-preview--rating">
                      4,7
                      <span className="features-snipped-preview--stars"></span>
                      (199)
                    </div>
                    <div className="features-snipped-preview--total-time">
                      30 Min.
                    </div>
                  </section>
                </div>
                <div className="col-8">
                  {/* <h4>1:1</h4> */}
                  <section className="features-result-preview">
                    <div className="features-result-preview--url">
                      www.chefkoch.de
                      <span className="features-result-preview--breadcrumb">
                        › ... › Kategorien › Menüart › Dessert
                      </span>
                    </div>
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
                            {" "}
                            08.05.2002 —{" "}
                          </span>
                          französische, hauchdünne Pfannkuchen. Über 667
                          Bewertungen und für schmackhaft befunden. Mit ▻
                          Portionsrechner ▻ Kochbuch&nbsp;...
                        </div>

                        <div className="features-result-preview--meta">
                          <span className="features-result-preview--rating"></span>
                          <span>Bewertung: 4,7</span> · &lrm;
                          <span>667 Ergebnisse</span> · &lrm;
                          <span>30 Min.</span> · &lrm;<span>Kalorien: 163</span>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
          {/* {props.attributes.image1_1 && (
              <img src={props.attributes.image1_1} />
            )}
            <MediaUploadCheck>
              <MediaUpload
                onSelect={(media) => {
                  if (media) {
                    props.setAttributes({ image1_1: media.url });
                  }
                }}
                allowedTypes={ALLOWED_MEDIA_TYPES}
                value={props.attributes.image16_9}
                render={({ open }) => (
                  <div>
                    <label>{__("Image (1:1)", "recipe-manager-pro")}</label>
                    <Button onClick={open} isSecondary={true}>
                      {__("Open Media Library", "recipe-manager-pro")}
                    </Button>
                  </div>
                )}
              />
            </MediaUploadCheck> */}
          {/* </div> */}
          {/* <div className="col-4">
            {props.attributes.image4_3 && (
              <img src={props.attributes.image4_3} />
            )}
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
                  <div>
                    <label>{__("Image (4:3)", "recipe-manager-pro")}</label>
                    <Button onClick={open} isSecondary={true}>
                      {__("Open Media Library", "recipe-manager-pro")}
                    </Button>
                  </div>
                )}
              />
            </MediaUploadCheck>
          </div> */}
          {/* <div className="col-4">
            {props.attributes.image16_9 && (
              <img src={props.attributes.image16_9} />
            )}
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
                  <div>
                    <label>{__("Image (16:9)", "recipe-manager-pro")}</label>
                    <Button onClick={open} isSecondary={true}>
                      {__("Open Media Library", "recipe-manager-pro")}
                    </Button>
                  </div>
                )}
              />
            </MediaUploadCheck>
          </div> */}
        </div>
      </div>
    </div>
  );
}
