import { __ } from "@wordpress/i18n";

import { Button } from "@wordpress/components";

import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";

import { Fragment } from "@wordpress/element";

export default function ImageUpload(args) {
  const props = args.props;
  const key = args.keyName;
  const label = args.label;
  const className = args.className;

  const ALLOWED_MEDIA_TYPES = ["image"];

  return (
    <MediaUploadCheck>
      <MediaUpload
        onSelect={(media) => {
          if (media) {
            const update = {};
            update[key] = media.url;
            update[key + "Id"] = media.id;
            props.setAttributes(update);
          }
        }}
        allowedTypes={ALLOWED_MEDIA_TYPES}
        value={props.attributes[key]}
        render={({ open }) => (
          <Fragment>
            <div
              className={"image-preview image-preview-" + className}
              style={{
                backgroundImage: "url(" + props.attributes[key] + ")",
              }}
              onClick={open}
            >
              {!props.attributes[key] ? <span className="aspect-ratio">{label}</span> : ""}
            </div>
            {props.attributes[key] ? (
              <Fragment>
                <Button isSecondary="true" onClick={open}>
                  {__("Change image", "recipe-creator")}
                </Button>
                <Button
                  onClick={() => {
                    const update = {};
                    update[key] = null;
                    update[key + "Id"] = null;
                    props.setAttributes(update);
                  }}
                >
                  {__("Remove image", "recipe-creator")}
                </Button>
              </Fragment>
            ) : (
              <Button isSecondary="true" onClick={open}>
                {__("Select image", "recipe-creator")}
              </Button>
            )}
          </Fragment>
        )}
      />
    </MediaUploadCheck>
  );
}
