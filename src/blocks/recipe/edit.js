import { __ } from "@wordpress/i18n";
import {
  TextControl,
  PanelBody,
  PanelRow,
  __experimentalNumberControl as NumberControl,
  __experimentalInputControl as InputControl,
} from "@wordpress/components";
import {
  useBlockProps,
  MediaUpload,
  MediaUploadCheck,
  RichText,
  InspectorControls,
  BlockControls,
} from "@wordpress/block-editor";
import { Fragment, useEffect } from "@wordpress/element";
import ImageUpload from "./ImageUpload";

import { extractTextFromHTMLString } from "./helper";

import { useDispatch, select, dispatch } from "@wordpress/data";

import RecipeYieldSelector from "./RecipeYieldSelector";
import PreparationStepsGroupsEditor from "./PreparationStepsGroupsEditor";
import IngredientsGroupsEditor from "./IngredientsGroupsEditor";

export default function Edit(props) {
  useEffect(() => {
    // In version 1.4.0 I added the possibility to split ingredient lists
    // So we have to migrate the old list (ingredients) to the new structure
    // of ingredientsGroups.

    if (props.attributes.ingredients) {
      props.setAttributes({
        ingredients: null,
        ingredientsGroups: [
          {
            title: "",
            list: props.attributes.ingredients,
          },
        ],
      });
    }

    if (props.attributes.preparationSteps) {
      props.setAttributes({
        preparationSteps: null,
        preparationStepsGroups: [
          {
            title: "",
            list: props.attributes.preparationSteps,
          },
        ],
      });
    }
  }, []);

  const { editPost } = useDispatch("core/editor");
  const setMeta = function (keyAndValue) {
    editPost({ meta: keyAndValue });
  };

  const ALLOWED_MEDIA_TYPES = ["image"];

  function updateTime(settingKey, value, update = {}) {
    let prepTime = parseInt(props.attributes.prepTime, 10) || 0;
    let restTime = parseInt(props.attributes.restTime, 10) || 0;
    let cookTime = parseInt(props.attributes.cookTime, 10) || 0;
    let bakingTime = parseInt(props.attributes.bakingTime, 10) || 0;

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
        case "bakingTime":
          bakingTime = intValue;
          update["bakingTime"] = "" + bakingTime;
          break;
      }

      update["totalTime"] = "" + (prepTime + restTime + cookTime + bakingTime);

      props.setAttributes(update);
    }
  }

  function updateRating(update) {
    const currentRating = {
      rating_1_votes: props.data.meta.rating_1_votes || 0,
      rating_2_votes: props.data.meta.rating_2_votes || 0,
      rating_3_votes: props.data.meta.rating_3_votes || 0,
      rating_4_votes: props.data.meta.rating_4_votes || 0,
      rating_5_votes: props.data.meta.rating_5_votes || 0,
      rating_count: props.data.meta.rating_count,
      average_rating: props.data.meta.average_rating,
    };

    const mergedRating = {
      ...currentRating,
      ...update,
    };

    const ratingCount =
      +mergedRating.rating_1_votes +
      +mergedRating.rating_2_votes +
      +mergedRating.rating_3_votes +
      +mergedRating.rating_4_votes +
      +mergedRating.rating_5_votes;

    const totalRating =
      +mergedRating.rating_1_votes * 1 +
      +mergedRating.rating_2_votes * 2 +
      +mergedRating.rating_3_votes * 3 +
      +mergedRating.rating_4_votes * 4 +
      +mergedRating.rating_5_votes * 5;

    const averageRating = Math.round((totalRating / ratingCount) * 10) / 10;

    const finalRating = {
      ...mergedRating,
      rating_count: ratingCount,
      average_rating: averageRating,
    };

    setMeta(finalRating);
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
        <div className="featured-snipped-preview--rating">
          {props.data.meta.average_rating}&nbsp;
          <span className="featured-snipped-preview--stars">
            <span
              className="featured-snipped-preview--stars--rated"
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
        <div className="featured-snipped-preview--rating">
          {__("No reviews", "recipe-creator")}
        </div>
      );
    }
  }

  function getYoutubeId(url) {
    if (url) {
      const match = url.match(
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
      );

      if (match && match[2].length === 11) {
        return match[2];
      }
    }

    return null;
  }

  function generateYoutubeEmbedUrl(id) {
    if (id) {
      return "//www.youtube-nocookie.com/embed/" + id;
    }

    return null;
  }

  function getVimeoId(url) {
    if (url) {
      const match = url.match(
        /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i
      );

      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }

  function generateVimeoEmbedUrl(id) {
    if (id) {
      return "//player.vimeo.com/video/" + id;
    }

    return null;
  }

  function generateIframeUrl(url) {
    // Check if it is a YouTube URL
    const youtubeId = getYoutubeId(url);

    if (youtubeId) {
      return generateYoutubeEmbedUrl(youtubeId);
    } else {
      // Check if it is a Vimeo URL
      const vimeoId = getVimeoId(url);

      if (vimeoId) {
        return generateVimeoEmbedUrl(vimeoId);
      }
    }

    return null;
  }

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody
          title={__("Pinterest", "recipe-creator")}
          className="recipe-creator--sidebar"
        >
          <PanelRow>
            <MediaUploadCheck>
              <MediaUpload
                onSelect={(media) => {
                  if (media) {
                    setMeta({
                      recipe_plugin_for_wp_image_id: media.id,
                      recipe_plugin_for_wp_image_url: media.url,
                    });
                  }
                }}
                allowedTypes={ALLOWED_MEDIA_TYPES}
                value={props.data.meta.recipe_plugin_for_wp_image_url}
                render={({ open }) => (
                  <Fragment>
                    <img
                      src={props.data.meta.recipe_plugin_for_wp_image_url}
                      onClick={open}
                    />
                    <button
                      type="button"
                      className="components-button is-secondary"
                      onClick={open}
                    >
                      {__("Select image", "recipe-creator")}
                    </button>
                  </Fragment>
                )}
              />
            </MediaUploadCheck>
          </PanelRow>
        </PanelBody>
        <PanelBody
          title={__("SEO", "recipe-creator")}
          className="recipe-creator--sidebar"
        >
          <PanelRow>
            <p>
              {__(
                "Google and other search engines need more information to present your recipe in the best possible way. You should provide this information as good as possible.",
                "recipe-creator"
              )}
            </p>
          </PanelRow>
          <PanelRow>
            <TextControl
              label={__("Cuisine", "recipe-creator")}
              value={props.attributes.recipeCuisine}
              placeholder={__(
                'e.g. "Italian" or "German"',
                "recipe-creator"
              )}
              onChange={(recipeCuisine) => {
                props.setAttributes({ recipeCuisine });
              }}
            />
          </PanelRow>
          <PanelRow>
            <TextControl
              type="number"
              label={__("Calories", "recipe-creator")}
              value={props.attributes.calories}
              description={__("Calories per serving or piece")}
              suffix="kcal"
              onChange={(calories) => {
                props.setAttributes({ calories });
              }}
            />
          </PanelRow>

          <hr />

          <PanelRow>
            <h4>
              {__("Picture of the finished dish", "recipe-creator")}
            </h4>
            <p>
              {__(
                "Depending on the usage Google uses different image formats of your recipe. You can find more information",
                "recipe-creator"
              )}
              &nbsp;
              <a
                href={__(
                  "https://www.howtofoodblog.com/mehr-klicks-durch-optimierte-rezeptbilder",
                  "recipe-creator"
                )}
                target="_blank"
              >
                {__("here", "recipe-creator")}
              </a>
              .
            </p>
          </PanelRow>
          <PanelRow>
            <ImageUpload
              props={props}
              keyName="image16_9"
              label="16:9"
              className="16-9"
            ></ImageUpload>
          </PanelRow>
          <hr />
          <PanelRow>
            <ImageUpload
              props={props}
              keyName="image3_2"
              label="3:2"
              className="3-2"
            ></ImageUpload>
          </PanelRow>
          <hr />
          <PanelRow>
            <ImageUpload
              props={props}
              keyName="image4_3"
              label="4:3"
              className="4-3"
            ></ImageUpload>
          </PanelRow>
          <hr />
          <PanelRow>
            <ImageUpload
              props={props}
              keyName="image1_1"
              label="1:1"
              className="1-1"
            ></ImageUpload>
          </PanelRow>
          <hr />

          <PanelRow>
            <h3>{__("Previews", "recipe-creator")}</h3>
            <h4>{__("Featured Snippet", "recipe-creator")}</h4>
          </PanelRow>

          <PanelRow>
            <section className="featured-snipped-preview">
              <div className="featured-snipped-preview--image-wrapper">
                <div
                  className="featured-snipped-preview--image"
                  style={{
                    backgroundImage: "url(" + props.attributes.image16_9 + ")",
                  }}
                ></div>
              </div>
              <div className="featured-snipped-preview--title">
                {extractTextFromHTMLString(props.attributes.name)}
              </div>
              <div className="featured-snipped-preview--blog-title">
                {extractTextFromHTMLString(props.data.site.title)}
              </div>
              {getRatingElement()}
              <div className="featured-snipped-preview--total-time">
                {props.attributes.totalTime} Min.
              </div>
            </section>
          </PanelRow>

          <PanelRow>
            <h4>{__("Mobile Search Result", "recipe-creator")}</h4>
          </PanelRow>

          <PanelRow>
            <section className="featured-result-preview-mobile">
              <header className="featured-result-preview-mobile--header">
                <span className="featured-result-preview-mobile--breadcrumb">
                  {(props.data.site.url || "").replace(/https?:\/\//, "")}
                </span>
                <h3 className="featured-result-preview-mobile--headline">
                  {extractTextFromHTMLString(props.attributes.name)}
                </h3>
              </header>
              <div className="featured-result-preview-mobile--image-text">
                <div
                  className="featured-result-preview-mobile--image"
                  style={{
                    backgroundImage: "url(" + props.attributes.image1_1 + ")",
                  }}
                ></div>
                <div className="featured-result-preview-mobile--text">
                  <div className="featured-result-preview-mobile--extract">
                    {/* <span className="featured-result-preview-mobile--date">
                      {props.data.publishDate} —
                    </span> */}
                    {__(
                      "Google displays here a text that matches the search term.",
                      "recipe-creator"
                    )}
                  </div>
                </div>
              </div>

              <div className="featured-result-preview-mobile--footer">
                <div className="featured-result-preview-mobile--rating-col">
                  <header>{__("Rating", "recipe-creator")}</header>
                  <p>
                    <span>{props.data.meta.average_rating}</span>
                    <span className="featured-snipped-preview--stars">
                      <span
                        className="featured-snipped-preview--stars--rated"
                        style={{
                          width:
                            getRatedStarsWidth(props.data.meta.average_rating) +
                            "px",
                        }}
                      ></span>
                    </span>
                    <span>({props.data.meta.rating_count})</span>{" "}
                  </p>
                </div>

                <div className="featured-result-preview-mobile--time-col">
                  <header>
                    {__("Preparation", "recipe-creator")}
                  </header>
                  <p>{props.attributes.totalTime} Min.</p>
                </div>

                {/* <div className="featured-result-preview-mobile--calories-col">
                  <header>{__("Calories", 'recipe-creator')}</header>
                  <p>{__("Calories", 'recipe-creator')}: 99</p>
                </div> */}
              </div>
            </section>
          </PanelRow>
        </PanelBody>

        <PanelBody
          title={__("Rating", "recipe-creator")}
          className="recipe-creator--sidebar"
        >
          <PanelRow>
            <p>
              <strong>{__("Attention:", "recipe-creator")}</strong>{" "}
              {__(
                "Adjusting the ratings can have an impact on your Google ranking. Be careful with this function.",
                "recipe-creator"
              )}
            </p>
          </PanelRow>
          <PanelRow>
            <NumberControl
              label={__("1 star", "recipe-creator")}
              min="0"
              value={props.data.meta.rating_1_votes || 0}
              onChange={(rating_1_votes) => {
                updateRating({ rating_1_votes });
              }}
            />
          </PanelRow>
          <PanelRow>
            <NumberControl
              label={__("2 stars", "recipe-creator")}
              min="0"
              value={props.data.meta.rating_2_votes || 0}
              onChange={(rating_2_votes) => {
                updateRating({ rating_2_votes });
              }}
            />
          </PanelRow>
          <PanelRow>
            <NumberControl
              label={__("3 stars", "recipe-creator")}
              min="0"
              value={props.data.meta.rating_3_votes || 0}
              onChange={(rating_3_votes) => {
                updateRating({ rating_3_votes });
              }}
            />
          </PanelRow>
          <PanelRow>
            <NumberControl
              label={__("4 stars", "recipe-creator")}
              min="0"
              value={props.data.meta.rating_4_votes || 0}
              onChange={(rating_4_votes) => {
                updateRating({ rating_4_votes });
              }}
            />
          </PanelRow>
          <PanelRow>
            <NumberControl
              label={__("5 stars", "recipe-creator")}
              min="0"
              value={props.data.meta.rating_5_votes || 0}
              onChange={(rating_5_votes) => {
                updateRating({ rating_5_votes });
              }}
            />
          </PanelRow>
          <PanelRow>
            <p>
              <strong>
                {__("Rating", "recipe-creator")}:{" "}
                {props.data.meta.average_rating} ({props.data.meta.rating_count}
                ){" "}
              </strong>
            </p>
          </PanelRow>
        </PanelBody>
      </InspectorControls>
      <div {...useBlockProps()}>
        <div className="wp-block recipe-creator--block recipe-creator--recipe-block">
          <BlockControls></BlockControls>
          <div className="recipe-creator--block--inner">
            <div className="recipe-creator--recipe-block--title">
              <RichText
                tagName="h2"
                value={props.attributes.name}
                __unstablePastePlainText={true}
                placeholder={__(
                  "Title of your recipe",
                  "recipe-creator"
                )}
                onChange={(name) => {
                  props.setAttributes({ name });
                }}
              />
            </div>
            <div className="recipe-creator--recipe-block--intro">
              <div className="recipe-creator--recipe-block--difficulty--selector">
                <span
                  className={
                    "recipe-creator--recipe-block--difficulty" +
                    (props.attributes.difficulty !== "simple"
                      ? " unselected"
                      : "")
                  }
                  onClick={() => {
                    props.setAttributes({ difficulty: "simple" });
                  }}
                >
                  {__("simple", "recipe-creator")}
                </span>
                <span
                  className={
                    "recipe-creator--recipe-block--difficulty" +
                    (props.attributes.difficulty !== "moderate"
                      ? " unselected"
                      : "")
                  }
                  onClick={() => {
                    props.setAttributes({ difficulty: "moderate" });
                  }}
                >
                  {__("moderate", "recipe-creator")}
                </span>
                <span
                  className={
                    "recipe-creator--recipe-block--difficulty" +
                    (props.attributes.difficulty !== "challenging"
                      ? " unselected"
                      : "")
                  }
                  onClick={() => {
                    props.setAttributes({ difficulty: "challenging" });
                  }}
                >
                  {__("challenging", "recipe-creator")}
                </span>
              </div>

              <RichText
                tagName="p"
                value={props.attributes.description}
                placeholder={__(
                  "Short description of your recipe",
                  "recipe-creator"
                )}
                __unstablePastePlainText={true}
                onChange={(description) => {
                  props.setAttributes({ description });
                }}
              />
            </div>

            <div
              className="recipe-creator--recipe-block--thumbnail"
              style={{
                backgroundImage: props.attributes.image3_2
                  ? "url(" + props.attributes.image3_2 + ")"
                  : "",
              }}
            >
              <MediaUploadCheck>
                <MediaUpload
                  onSelect={(media) => {
                    if (media) {
                      props.setAttributes({
                        image3_2: media.url,
                        image3_2Id: media.id,
                      });
                    }
                  }}
                  allowedTypes={ALLOWED_MEDIA_TYPES}
                  value={props.attributes.image3_2}
                  render={({ open }) => (
                    <div
                      className={
                        "recipe-creator--recipe-block--thumbnail-spacer" +
                        (props.attributes.image3_2
                          ? ""
                          : " recipe-creator--empty")
                      }
                      onClick={open}
                    ></div>
                  )}
                />
              </MediaUploadCheck>
            </div>

            <div className="recipe-creator--recipe-block--timings">
              <ul>
                <li>
                  <header>{__("Prep time", "recipe-creator")}:</header>
                  <span>
                    <InputControl
                      type="number"
                      min="0"
                      value={props.attributes.prepTime}
                      placeholder="0"
                      onChange={(prepTime) => {
                        updateTime("prepTime", prepTime);
                      }}
                      suffix={__("Min.", "recipe-creator")}
                    />
                  </span>
                </li>
                <li>
                  <header>{__("Rest time", "recipe-creator")}:</header>
                  <span>
                    <InputControl
                      type="number"
                      min="0"
                      value={props.attributes.restTime}
                      placeholder="0"
                      onChange={(restTime) => {
                        updateTime("restTime", restTime);
                      }}
                      suffix={__("Min.", "recipe-creator")}
                    />
                  </span>
                </li>
                <li>
                  <header>{__("Cook time", "recipe-creator")}:</header>
                  <span>
                    <InputControl
                      type="number"
                      min="0"
                      value={props.attributes.cookTime}
                      placeholder="0"
                      onChange={(cookTime) => {
                        updateTime("cookTime", cookTime);
                      }}
                      suffix={__("Min.", "recipe-creator")}
                    />
                  </span>
                </li>
                <li>
                  <header>
                    {__("Baking time", "recipe-creator")}:
                  </header>
                  <span>
                    <InputControl
                      type="number"
                      min="0"
                      value={props.attributes.bakingTime}
                      placeholder="0"
                      onChange={(bakingTime) => {
                        updateTime("bakingTime", bakingTime);
                      }}
                      suffix={__("Min.", "recipe-creator")}
                    />
                  </span>
                </li>

                <li>
                  <header>
                    {__("Total time", "recipe-creator")}:
                  </header>
                  <span>
                    {props.attributes.totalTime || "0"}{" "}
                    {__("Min.", "recipe-creator")}
                  </span>
                </li>
              </ul>
            </div>

            <section className="recipe-creator--recipe-block--ingredients">
              <div className="recipe-creator--recipe-block--headline">
                <h3>{__("Ingredients", "recipe-creator")}</h3>
              </div>
              <div className="recipe-creator--recipe-block--flex-container">
                <RecipeYieldSelector props={props}></RecipeYieldSelector>
              </div>

              <IngredientsGroupsEditor props={props}></IngredientsGroupsEditor>
            </section>

            <section className="recipe-creator--recipe-block--utensils">
              <div className="recipe-creator--recipe-block--headline">
                <h3>{__("Utensils", "recipe-creator")}</h3>
              </div>

              <RichText
                tagName="ul"
                multiline="li"
                className="recipe-creator--recipe-block--utensils-list"
                placeholder={__(
                  "Add the needed utensils here...",
                  "recipe-creator"
                )}
                value={props.attributes.utensils}
                __unstablePastePlainText={true}
                onChange={(utensils) => props.setAttributes({ utensils })}
              />
            </section>

            <div className="recipe-creator--recipe-block--preparation-steps">
              <div className="recipe-creator--recipe-block--headline">
                <h3>{__("Steps of preparation", "recipe-creator")}</h3>
              </div>

              <PreparationStepsGroupsEditor
                props={props}
              ></PreparationStepsGroupsEditor>
            </div>

            <section className="recipe-creator--recipe-block--video">
              <div className="recipe-creator--recipe-block--headline">
                <h3>{__("Video", "recipe-creator")}</h3>
              </div>

              <div className="recipe-creator--recipe-block--flex-container">
                <TextControl
                  label={__("YouTube or Vimeo link", "recipe-creator")}
                  value={props.attributes.videoUrl}
                  onChange={(url) => {
                    if (url) {
                      const iframeUrl = generateIframeUrl(url);
                      if (iframeUrl) {
                        props.setAttributes({
                          videoUrl: url,
                          videoIframeUrl: iframeUrl,
                        });
                      } else {
                        props.setAttributes({
                          videoUrl: url,
                          videoIframeUrl: null,
                        });
                      }
                    }
                  }}
                />
              </div>
            </section>

            <section className="recipe-creator--recipe-block--notes">
              <div className="recipe-creator--recipe-block--headline">
                <h3>{__("Notes", "recipe-creator")}</h3>
              </div>

              <RichText
                tagName="p"
                value={props.attributes.notes}
                placeholder={__(
                  "Additional notes ...",
                  "recipe-creator"
                )}
                __unstablePastePlainText={true}
                onChange={(notes) => {
                  props.setAttributes({ notes });
                }}
              />
            </section>
          </div>
        </div>
      </div>

      {!select("core/edit-post").isEditorSidebarOpened() ? (
        <button
          type="button"
          className="components-button is-tertiary recipe-creator--show-additional-settings"
          onClick={() => {
            dispatch("core/edit-post").openGeneralSidebar("edit-post/document");
          }}
        >
          {__("Show additional settings", "recipe-creator")}
        </button>
      ) : null}
    </Fragment>
  );
}
