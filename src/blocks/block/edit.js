import { __ } from "@wordpress/i18n";
import {
  TextControl,
  PanelBody,
  PanelRow,
  SelectControl,
  Button,
  __experimentalInputControl as InputControl,
} from "@wordpress/components";
import {
  MediaUpload,
  MediaUploadCheck,
  RichText,
  InspectorControls,
} from "@wordpress/block-editor";
import { Fragment, useEffect } from "@wordpress/element";
import ImageUpload from "./ImageUpload";

import { useDispatch } from "@wordpress/data";

import "./editor.scss";

export default function Edit(props) {
  const updateAttributes = (data) => {
    useEffect(() => {
      props.setAttributes(data);
    });
  }

  const { editPost } = useDispatch('core/editor');
  const setMeta = function (keyAndValue) {
    editPost({ meta: keyAndValue })
  }

  const ALLOWED_MEDIA_TYPES = ["image"];

  const categoryOptions = [
    __("Breakfast", 'foodblogkitchen-toolkit'),
    __("Bread", 'foodblogkitchen-toolkit'),
    __("Appetizers & Snacks", 'foodblogkitchen-toolkit'),
    __("Salads", 'foodblogkitchen-toolkit'),
    __("Soups & Stews", 'foodblogkitchen-toolkit'),
    __("Main Dishes", 'foodblogkitchen-toolkit'),
    __("Side Dishes", 'foodblogkitchen-toolkit'),
    __("Desserts", 'foodblogkitchen-toolkit'),
    __("Drinks", 'foodblogkitchen-toolkit'),
    __("Sweets", 'foodblogkitchen-toolkit'),
  ].map((value) => {
    return { label: value, value: value };
  });

  categoryOptions.unshift({
    value: "",
    label: __("Select a category", 'foodblogkitchen-toolkit'),
  });

  const recipeYieldUnitOptions = [
    {
      value: "servings",
      label: __("servings", 'foodblogkitchen-toolkit'),
    },
    {
      value: "piece",
      label: __("piece", 'foodblogkitchen-toolkit'),
    },
  ];

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
          {__("No reviews", 'foodblogkitchen-toolkit')}
        </div>
      );
    }
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
      return '//www.youtube-nocookie.com/embed/' + id;
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
      return '//player.vimeo.com/video/' + id;
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

  // In version 1.4.0 I added the possibility to split ingredient lists
  // So we have to migrate the old list (ingredients) to the new structure
  // of ingredientsGroups.
  if (props.attributes.ingredients) {
    updateAttributes({
      ingredients: null,
      ingredientsGroups: [{
        title: '',
        list: props.attributes.ingredients
      }]
    });
  }

  function addIngredientsGroup() {
    const update = [...props.attributes.ingredientsGroups];
    update.push({
      title: '',
      list: ''
    });
    props.setAttributes({ ingredientsGroups: update });

    return false;
  }

  function removeIngredientsGroup(index) {
    if (props.attributes.ingredientsGroups[index]) {
      if (confirm(__("Are you shure you want to delete this group. All ingredients will be deleted."))) {
        const update = [...props.attributes.ingredientsGroups];
        update.splice(index, 1);

        if (update.length === 0) {
          update.push({
            title: '',
            list: ''
          });
        } else if (update.length === 1) {
          // If the length is now 1, the title must be reset to an empty string
          update[0].title = '';
        }

        props.setAttributes({ ingredientsGroups: update });
      }
    }

    return false;
  }

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody
          title={__("Pinterest", 'foodblogkitchen-toolkit')}
          className="foodblogkitchen-toolkit--sidebar"
        >
          <PanelRow>
            <MediaUploadCheck>
              <MediaUpload
                onSelect={(media) => {
                  if (media) {
                    console.log(media);
                    setMeta({
                      foodblogkitchen_pinterest_image_id: media.id,
                      foodblogkitchen_pinterest_image_url: media.url,
                    });
                  }
                }}
                allowedTypes={ALLOWED_MEDIA_TYPES}
                value={props.data.meta.foodblogkitchen_pinterest_image_url}
                render={({ open }) => (
                  <Fragment>
                    <img src={props.data.meta.foodblogkitchen_pinterest_image_url}
                      onClick={open}
                    />
                    <button type="button" className="components-button is-secondary" onClick={open}>{__("Select image", 'foodblogkitchen-toolkit')}</button>
                  </Fragment>
                )}
              />
            </MediaUploadCheck>
          </PanelRow>
        </PanelBody>
        <PanelBody
          title={__("SEO", 'foodblogkitchen-toolkit')}
          className="foodblogkitchen-toolkit--sidebar"
        >
          <PanelRow>
            <p>
              {__(
                "Google and other search engines need more information to present your recipe in the best possible way. You should provide this information as good as possible.",
                'foodblogkitchen-toolkit'
              )}
            </p>
          </PanelRow>
          <PanelRow>
            <TextControl
              label={__("Cuisine", 'foodblogkitchen-toolkit')}
              value={props.attributes.recipeCuisine}
              placeholder={__(
                'e.g. "Italian" or "German"',
                'foodblogkitchen-toolkit'
              )}
              onChange={(recipeCuisine) => {
                props.setAttributes({ recipeCuisine });
              }}
            />
          </PanelRow>
          <PanelRow>
            <TextControl
              type="number"
              label={__("Calories", 'foodblogkitchen-toolkit')}
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
              {__("Picture of the finished dish", 'foodblogkitchen-toolkit')}
            </h4>
            <p>
              {__(
                "Depending on the usage Google uses different image formats of your recipe. You can find more information",
                'foodblogkitchen-toolkit'
              )}
              &nbsp;
              <a
                href={__(
                  "https://foodblogkitchen.de/mehr-klicks-durch-optimierte-rezeptbilder/",
                  'foodblogkitchen-toolkit'
                )}
                target="_blank"
              >
                {__("here", 'foodblogkitchen-toolkit')}
              </a>
              .
            </p>
          </PanelRow>
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
              keyName="image1_1"
              label="1:1"
              className="1-1"
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
              keyName="image16_9"
              label="16:9"
              className="16-9"
            ></ImageUpload>
          </PanelRow>

          <hr />

          <PanelRow>
            <h3>{__("Previews", 'foodblogkitchen-toolkit')}</h3>
            <h4>{__("Featured Snippet", 'foodblogkitchen-toolkit')}</h4>
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
                {props.attributes.name}
              </div>
              <div className="featured-snipped-preview--blog-title">
                {props.data.site.title}
              </div>
              {getRatingElement()}
              <div className="featured-snipped-preview--total-time">
                {props.attributes.totalTime} Min.
              </div>
            </section>
          </PanelRow>

          <PanelRow>
            <h4>{__("Mobile Search Result", 'foodblogkitchen-toolkit')}</h4>
          </PanelRow>

          <PanelRow>
            <section className="featured-result-preview-mobile">
              <header className="featured-result-preview-mobile--header">
                <span className="featured-result-preview-mobile--breadcrumb">
                  {(props.data.site.url || '').replace(/https?:\/\//, '')}
                </span>
                <h3 className="featured-result-preview-mobile--headline">
                  {props.attributes.name}
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
                    {__("Google displays here a text that matches the search term.", "foodblogkitchen-toolkit")}
                  </div>
                </div>
              </div>

              <div className="featured-result-preview-mobile--footer">
                <div className="featured-result-preview-mobile--rating-col">
                  <header>{__("Rating", 'foodblogkitchen-toolkit')}</header>
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
                    {__("Preparation", 'foodblogkitchen-toolkit')}
                  </header>
                  <p>{props.attributes.totalTime} Min.</p>
                </div>

                {/* <div className="featured-result-preview-mobile--calories-col">
                  <header>{__("Calories", 'foodblogkitchen-toolkit')}</header>
                  <p>{__("Calories", 'foodblogkitchen-toolkit')}: 99</p>
                </div> */}
              </div>
            </section>
          </PanelRow>
        </PanelBody>
      </InspectorControls>
      <div className={"foodblogkitchen-toolkit--block " + props.className}>
        <RichText
          tagName="h2"
          value={props.attributes.name}
          placeholder={__("Title of your recipe", 'foodblogkitchen-toolkit')}
          onChange={(name) => {
            props.setAttributes({ name });
          }}
        />
        <div className="foodblogkitchen-toolkit--recipe-block--intro">
          <div>
            <span
              className={
                "foodblogkitchen-toolkit--recipe-block--difficulty" +
                (props.attributes.difficulty !== "simple" ? " unselected" : "")
              }
              onClick={() => {
                props.setAttributes({ difficulty: "simple" });
              }}
            >
              {__("simple", 'foodblogkitchen-toolkit')}
            </span>
            <span
              className={
                "foodblogkitchen-toolkit--recipe-block--difficulty" +
                (props.attributes.difficulty !== "moderate"
                  ? " unselected"
                  : "")
              }
              onClick={() => {
                props.setAttributes({ difficulty: "moderate" });
              }}
            >
              {__("moderate", 'foodblogkitchen-toolkit')}
            </span>
            <span
              className={
                "foodblogkitchen-toolkit--recipe-block--difficulty" +
                (props.attributes.difficulty !== "challenging"
                  ? " unselected"
                  : "")
              }
              onClick={() => {
                props.setAttributes({ difficulty: "challenging" });
              }}
            >
              {__("challenging", 'foodblogkitchen-toolkit')}
            </span>

            <RichText
              tagName="p"
              value={props.attributes.description}
              placeholder={__(
                "Short description of your recipe",
                'foodblogkitchen-toolkit'
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
                      "foodblogkitchen-toolkit--recipe-block--main-image" +
                      (props.attributes.image3_2
                        ? ""
                        : " foodblogkitchen-toolkit--empty")
                    }
                    style={{
                      backgroundImage: props.attributes.image3_2
                        ? "url(" + props.attributes.image3_2 + ")"
                        : "",
                    }}
                    onClick={open}
                  ></div>
                )}
              />
            </MediaUploadCheck>
          </div>
        </div>
        <hr />
        <div className="foodblogkitchen-toolkit--recipe-block--timing-list">
          <ul>
            <li>
              <header>{__("Prep time", 'foodblogkitchen-toolkit')}:</header>
              <span>
                <InputControl
                  type="number"
                  min="0"
                  value={props.attributes.prepTime}
                  placeholder="0"
                  onChange={(prepTime) => {
                    updateTime("prepTime", prepTime);
                  }}
                  suffix={__("Min.", 'foodblogkitchen-toolkit')}
                />
              </span>
            </li>
            <li>
              <header>{__("Rest time", 'foodblogkitchen-toolkit')}:</header>
              <span>
                <InputControl
                  type="number"
                  min="0"
                  value={props.attributes.restTime}
                  placeholder="0"
                  onChange={(restTime) => {
                    updateTime("restTime", restTime);
                  }}
                  suffix={__("Min.", 'foodblogkitchen-toolkit')}
                />
              </span>
            </li>
            <li>
              <header>{__("Cook time", 'foodblogkitchen-toolkit')}:</header>
              <span>
                <InputControl
                  type="number"
                  min="0"
                  value={props.attributes.cookTime}
                  placeholder="0"
                  onChange={(cookTime) => {
                    updateTime("cookTime", cookTime);
                  }}
                  suffix={__("Min.", 'foodblogkitchen-toolkit')}
                />
              </span>
            </li>
            <li>
              <header>{__("Baking time", 'foodblogkitchen-toolkit')}:</header>
              <span>
                <InputControl
                  type="number"
                  min="0"
                  value={props.attributes.bakingTime}
                  placeholder="0"
                  onChange={(bakingTime) => {
                    updateTime("bakingTime", bakingTime);
                  }}
                  suffix={__("Min.", 'foodblogkitchen-toolkit')}
                />
              </span>
            </li>

            <li>
              <header>{__("Total time", 'foodblogkitchen-toolkit')}:</header>
              <span>
                {props.attributes.totalTime || "0"}{" "}
                {__("Min.", 'foodblogkitchen-toolkit')}
              </span>
            </li>
          </ul>
        </div>
        <hr />
        <div className="foodblogkitchen-toolkit--recipe-block--headline">
          <h3>{__("Ingredients", 'foodblogkitchen-toolkit')}</h3>
        </div>
        <div className="foodblogkitchen-toolkit--recipe-block--flex-container">
          <InputControl
            label={__("Results in", 'foodblogkitchen-toolkit')}
            type="number"
            min="0"
            value={props.attributes.recipeYield}
            placeholder="0"
            onChange={(recipeYield) => {
              props.setAttributes({ recipeYield });
            }}
          />

          <SelectControl
            label={__("Unit", 'foodblogkitchen-toolkit')}
            value={props.attributes.recipeYieldUnit}
            options={recipeYieldUnitOptions}
            onChange={(recipeYieldUnit) =>
              props.setAttributes({ recipeYieldUnit })
            }
          />
        </div>

        {(
          props.attributes.ingredientsGroups.map((group, index) => {
            return (
              <div key={"ingredientsGroups_" + index} className="foodblogkitchen-toolkit--recipe-block--ingredients">
                {
                  (
                    (index !== 0 || props.attributes.ingredientsGroups.length > 1) ?
                      <div className="foodblogkitchen-toolkit--recipe-block--group-header">
                        <RichText
                          tagName="h3"
                          value={group.title || ''}
                          placeholder={__("Group name", 'foodblogkitchen-toolkit')}
                          onChange={(value) => {
                            const groupUpdate = {
                              ...group,
                              title: value
                            };

                            const update = [...props.attributes.ingredientsGroups];
                            update[index] = groupUpdate;

                            props.setAttributes({ ingredientsGroups: update });
                          }}
                        />
                        <Button isTertiary={true} onClick={() => removeIngredientsGroup(index)}>{__("Remove Group", "foodblogkitchen-toolkit")}</Button>
                      </div> : ''
                  )
                }
                <RichText
                  tagName="ul"
                  multiline="li"
                  placeholder={__(
                    "Add the ingredients here...",
                    'foodblogkitchen-toolkit'
                  )}
                  value={group.list || ''}
                  onChange={(value) => {
                    const groupUpdate = {
                      ...group,
                      list: value
                    };

                    const update = [...props.attributes.ingredientsGroups];
                    update[index] = groupUpdate;

                    props.setAttributes({ ingredientsGroups: update });
                  }}
                />
              </div>
            )
          })
        )}

        <Button isSecondary={true} onClick={addIngredientsGroup}>{(
          props.attributes.ingredientsGroups.length === 1 ?
            __("Split ingredients into groups", "foodblogkitchen-toolkit") :
            __("Add additional group", "foodblogkitchen-toolkit")
        )}</Button>

        <div className="foodblogkitchen-toolkit--recipe-block--headline">
          <h3>{__("Steps of preparation", 'foodblogkitchen-toolkit')}</h3>
        </div>

        <RichText
          tagName="ol"
          multiline="li"
          className="foodblogkitchen-toolkit--recipe-block--preparation-steps"
          placeholder={__(
            "Add the steps of preparation here...",
            'foodblogkitchen-toolkit'
          )}
          value={props.attributes.preparationSteps}
          onChange={(preparationSteps) =>
            props.setAttributes({ preparationSteps })
          }
        />

        <hr />

        <div className="foodblogkitchen-toolkit--recipe-block--headline">
          <h3>{__("Video", 'foodblogkitchen-toolkit')}</h3>
        </div>

        <div className="foodblogkitchen-toolkit--recipe-block--flex-container foodblogkitchen-toolkit--recipe-block--video">
          <TextControl
            label={__("YouTube or Vimeo link", 'foodblogkitchen-toolkit')}
            value={props.attributes.videoUrl}
            onChange={(url) => {
              if (url) {
                const iframeUrl = generateIframeUrl(url);
                console.log('iframeUrl', iframeUrl);
                if (iframeUrl) {
                  props.setAttributes({ videoUrl: url, videoIframeUrl: iframeUrl });
                } else {
                  props.setAttributes({ videoUrl: url, videoIframeUrl: null });
                }
              }
            }}
          />
        </div>

        <hr />

        <div className="foodblogkitchen-toolkit--recipe-block--headline">
          <h3>{__("Notes", 'foodblogkitchen-toolkit')}</h3>
        </div>

        <RichText
          tagName="p"
          value={props.attributes.notes}
          placeholder={__("Additional notes ...", 'foodblogkitchen-toolkit')}
          onChange={(notes) => {
            props.setAttributes({ notes });
          }}
        />

        {/* <section>
          <div className="foodblogkitchen-toolkit--recipe-block--headline">
            <h3>{__("Video", 'foodblogkitchen-toolkit')}</h3>
          </div>
          <TextControl
            label={__("Video-URL", 'foodblogkitchen-toolkit')}
            value={props.attributes.videoUrl}
            type="number"
            onChange={(videoUrl) => props.setAttributes({ videoUrl })}
          />
        </section> */}
      </div>
    </Fragment >
  );
}
