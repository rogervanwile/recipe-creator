import { __ } from "@wordpress/i18n";
import { RichText } from "@wordpress/block-editor";
import { useRef, useEffect } from "@wordpress/element";
import { cloneDeep } from "lodash";
import { create, split, toHTMLString } from "@wordpress/rich-text";

export default function RichTextList({ list, onChange, placeholder, tagName = "ul" }) {
  const richTextRefs = useRef([]);

  useEffect(() => {
    if (list.length === 0) {
      // The list must always have one item
      onChange([""]);
    }
  }, []);

  const TagName = tagName;

  return (
    <TagName>
      {(list || [""]).map((item, index) => {
        return (
          <li>
            <RichText
              disableLineBreaks={true}
              value={item || ""}
              placeholder={placeholder}
              __unstablePastePlainText={true}
              onChange={(value) => {
                const update = cloneDeep(list);
                update[index] = value;
                onChange(update);
              }}
              onKeyUp={(event) => {
                if (event.key === "Enter") {
                  event.stopPropagation();
                  event.preventDefault();

                  const { offset: start } = wp.data.select("core/block-editor").getSelectionStart();
                  const { offset: end } = wp.data.select("core/block-editor").getSelectionEnd();

                  // Cannot split if there is no selection.
                  if (typeof start !== "number" || typeof end !== "number") {
                    return;
                  }

                  const richTextValue = create({ html: item });
                  richTextValue.start = start;
                  richTextValue.end = end;

                  const array = split(richTextValue).map((v) => toHTMLString({ value: v }));

                  const newValues = list.slice();
                  newValues.splice(index, 1, ...array);
                  onChange(newValues);

                  // Focus next item
                  window.requestAnimationFrame(() => {
                    const nextIndex = index + 1;
                    if (richTextRefs.current[nextIndex]) {
                      richTextRefs.current[nextIndex].focus();
                    }
                  });
                }

                if (event.key === "Backspace") {
                  const { offset: start } = wp.data.select("core/block-editor").getSelectionStart();
                  const { offset: end } = wp.data.select("core/block-editor").getSelectionEnd();

                  const newValues = list.slice();

                  const prevIndex = index - 1;
                  let prevItemOffset = richTextRefs.current[prevIndex].innerText.length;

                  if (item === "") {
                    // Remove a empty line
                    newValues.splice(index, 1);
                  } else if (start === 0 && end === 0) {
                    // Remove a line break when pressing backspace at the beginning of a line

                    newValues[prevIndex] = list[prevIndex] + item;
                    newValues.splice(index, 1);
                  } else {
                    return;
                  }

                  event.preventDefault();
                  event.stopPropagation();

                  onChange(newValues);

                  // Move the caret to the position
                  window.requestAnimationFrame(() => {
                    // Focus previous item
                    try {
                      const prevIndex = index - 1;
                      if (prevIndex > 0) {
                        const richTextElementToFocus = richTextRefs.current[prevIndex];
                        richTextElementToFocus.focus();

                        const selection = window.getSelection();

                        // Set the caret to the beggining
                        selection.collapse(richTextElementToFocus, 0);

                        // Move the caret to the position
                        for (let index = 0; index < prevItemOffset; index++) {
                          selection.modify("move", "forward", "character");
                        }
                      }
                    } catch (e) {
                      console.error(e);
                    }
                  });
                }
              }}
              ref={(el) => (richTextRefs.current[index] = el)}
            />
          </li>
        );
      })}
    </TagName>
  );
}
