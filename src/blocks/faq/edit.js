import { __ } from "@wordpress/i18n";
import {
  useBlockProps,
  RichText,
  BlockControls,
} from "@wordpress/block-editor";

export default function Edit(props) {
  return (
    <div {...useBlockProps()}>
      <BlockControls></BlockControls>

      <RichText
        tagName="h2"
        value={props.attributes.question || ""}
        placeholder={__("Your questions", "foodblogkitchen-toolkit")}
        onChange={(value) => {
          props.setAttributes({ question: value });
        }}
      />
      <RichText
        tagName="p"
        value={props.attributes.answer || ""}
        placeholder={__("Your answer", "foodblogkitchen-toolkit")}
        onChange={(value) => {
          props.setAttributes({ answer: value });
        }}
      />
    </div>
  );
}
