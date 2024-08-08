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

import { useDispatch, select, dispatch } from "@wordpress/data";

import RecipeYieldSelector from "./RecipeYieldSelector";
import PreparationStepsGroupsEditor from "./PreparationStepsGroupsEditor";
import IngredientsGroupsEditor from "./IngredientsGroupsEditor";
import RichTextList from "./RichTextList";

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
      recipe_creator__rating_1_votes: props.data.meta.recipe_creator__rating_1_votes || 0,
      recipe_creator__rating_2_votes: props.data.meta.recipe_creator__rating_2_votes || 0,
      recipe_creator__rating_3_votes: props.data.meta.recipe_creator__rating_3_votes || 0,
      recipe_creator__rating_4_votes: props.data.meta.recipe_creator__rating_4_votes || 0,
      recipe_creator__rating_5_votes: props.data.meta.recipe_creator__rating_5_votes || 0,
      recipe_creator__rating_count: props.data.meta.recipe_creator__rating_count,
      recipe_creator__average_rating: props.data.meta.recipe_creator__average_rating,
    };

    const mergedRating = {
      ...currentRating,
      ...update,
    };

    const ratingCount =
      +mergedRating.recipe_creator__rating_1_votes +
      +mergedRating.recipe_creator__rating_2_votes +
      +mergedRating.recipe_creator__rating_3_votes +
      +mergedRating.recipe_creator__rating_4_votes +
      +mergedRating.recipe_creator__rating_5_votes;

    const totalRating =
      +mergedRating.recipe_creator__rating_1_votes * 1 +
      +mergedRating.recipe_creator__rating_2_votes * 2 +
      +mergedRating.recipe_creator__rating_3_votes * 3 +
      +mergedRating.recipe_creator__rating_4_votes * 4 +
      +mergedRating.recipe_creator__rating_5_votes * 5;

    const averageRating = Math.round((totalRating / ratingCount) * 10) / 10;

    const finalRating = {
      ...mergedRating,
      recipe_creator__rating_count: ratingCount,
      recipe_creator__average_rating: averageRating,
    };

    setMeta(finalRating);
  }

  function getYoutubeId(url) {
    if (url) {
      const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);

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
      const match = url.match(/(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i);

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
        <PanelBody title={__("Pinterest", "recipe-creator")} className="recipe-creator--sidebar">
          <PanelRow>
            <MediaUploadCheck>
              <MediaUpload
                onSelect={(media) => {
                  if (media) {
                    props.setAttributes({ pinterestImageId: media.id, pinterestImageUrl: media.url });
                  }
                }}
                allowedTypes={ALLOWED_MEDIA_TYPES}
                value={props.attributes.pinterestImageUrl}
                render={({ open }) => (
                  <Fragment>
                    <img src={props.attributes.pinterestImageUrl} onClick={open} />
                    <button type="button" className="components-button is-secondary" onClick={open}>
                      {__("Select image", "recipe-creator")}
                    </button>
                  </Fragment>
                )}
              />
            </MediaUploadCheck>
          </PanelRow>
        </PanelBody>
        <PanelBody title={__("SEO", "recipe-creator")} className="recipe-creator--sidebar">
          <PanelRow>
            <p>
              {__(
                "Google and other search engines need more information to present your recipe in the best possible way. You should provide this information as good as possible.",
                "recipe-creator",
              )}
            </p>
          </PanelRow>
          <PanelRow>
            <TextControl
              label={__("Cuisine", "recipe-creator")}
              value={props.attributes.recipeCuisine}
              placeholder={__('e.g. "Italian" or "German"', "recipe-creator")}
              onChange={(recipeCuisine) => {
                props.setAttributes({ recipeCuisine });
              }}
            />
          </PanelRow>

          <hr />

          <PanelRow>
            <h4>{__("Picture of the finished dish", "recipe-creator")}</h4>
            <p>
              {__(
                "Depending on the usage Google uses different image formats of your recipe. You can find more information",
                "recipe-creator",
              )}
              &nbsp;
              <a
                href={__("https://recipe-creator.de/mehr-klicks-durch-optimierte-rezeptbilder", "recipe-creator")}
                target="_blank"
              >
                {__("here", "recipe-creator")}
              </a>
              .
            </p>
          </PanelRow>
          <PanelRow>
            <ImageUpload props={props} keyName="image16_9" label="16:9" className="16-9"></ImageUpload>
          </PanelRow>
          <hr />
          <PanelRow>
            <ImageUpload props={props} keyName="image3_2" label="3:2" className="3-2"></ImageUpload>
          </PanelRow>
          <hr />
          <PanelRow>
            <ImageUpload props={props} keyName="image4_3" label="4:3" className="4-3"></ImageUpload>
          </PanelRow>
          <hr />
          <PanelRow>
            <ImageUpload props={props} keyName="image1_1" label="1:1" className="1-1"></ImageUpload>
          </PanelRow>
        </PanelBody>
      </InspectorControls>
      <div {...useBlockProps()}>
        <div className="wp-block recipe-creator recipe-creator--block recipe-creator--recipe-block">
          <BlockControls></BlockControls>
          <div className="recipe-creator--block--inner">
            <div className="recipe-creator--recipe-block--title">
              <RichText
                tagName="h2"
                value={props.attributes.name}
                __unstablePastePlainText={true}
                placeholder={__("Title of your recipe", "recipe-creator")}
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
                    (props.attributes.difficulty !== "simple" ? " unselected" : "")
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
                    (props.attributes.difficulty !== "moderate" ? " unselected" : "")
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
                    (props.attributes.difficulty !== "challenging" ? " unselected" : "")
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
                placeholder={__("Short description of your recipe", "recipe-creator")}
                __unstablePastePlainText={true}
                onChange={(description) => {
                  props.setAttributes({ description });
                }}
              />
            </div>

            <div
              className="recipe-creator--recipe-block--thumbnail"
              style={{
                backgroundImage: props.attributes.image3_2 ? "url(" + props.attributes.image3_2 + ")" : "",
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
                        (props.attributes.image3_2 ? "" : " recipe-creator--empty")
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
                  <header>{__("Baking time", "recipe-creator")}:</header>
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
                  <header>{__("Total time", "recipe-creator")}:</header>
                  <span>
                    {props.attributes.totalTime || "0"} {__("Min.", "recipe-creator")}
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

              <RichTextList
                list={props.attributes.utensils}
                onChange={(utensils) => {
                  props.setAttributes({ utensils });
                }}
                placeholder={__("Add the needed utensils here...", "recipe-creator")}
              />
            </section>

            <div className="recipe-creator--recipe-block--preparation-steps">
              <div className="recipe-creator--recipe-block--headline">
                <h3>{__("Steps of preparation", "recipe-creator")}</h3>
              </div>

              <PreparationStepsGroupsEditor props={props}></PreparationStepsGroupsEditor>
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
                placeholder={__("Additional notes ...", "recipe-creator")}
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
