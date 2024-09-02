import { __ } from "@wordpress/i18n";
import { RichText } from "@wordpress/block-editor";
import { useRef, useEffect, useState } from "@wordpress/element";
import { cloneDeep } from "lodash";

export default function RichTextList({ list, onChange, placeholder, tagName = "ul" }) {
  const richTextRefs = useRef([]);

  useEffect(() => {
    if (list.length === 0) {
      // The list must always have one item
      onChange([""]);
    }
  }, []);

  function addItem(index) {
    const listUpdate = cloneDeep(list);
    listUpdate.splice(index + 1, 0, "");

    onChange(listUpdate);
  }

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
                  addItem(index);

                  // If the cursor is not at the end, split the text
                  const selection = window.getSelection();
                  const range = selection.getRangeAt(0);
                  if (range.endOffset < range.endContainer.length) {
                    const text = range.endContainer.textContent;
                    const textBefore = text.substring(0, range.endOffset);
                    const textAfter = text.substring(range.endOffset);

                    const update = cloneDeep(list);
                    update[index] = textBefore;

                    if (update.length >= index + 1) {
                      update.splice(index + 1, 0, textAfter);
                    } else {
                      update.push(textAfter);
                    }

                    onChange(update);
                  }

                  // Focus next item
                  window.setTimeout(() => {
                    const nextIndex = index + 1;
                    if (richTextRefs.current[nextIndex]) {
                      richTextRefs.current[nextIndex].focus();
                    }
                  }, 0);
                }

                if (event.key === "Backspace") {
                  const range = window.getSelection().getRangeAt(0);
                  const cursorPosition = range.startOffset;

                  // TODO: Wenn ein HTML-Element in dem Listeneintrag ist, funktioniert das Löschen mit Backspace nicht korrekt
                  if (cursorPosition === 0) {
                    const prevIndex = index - 1;
                    let prevItemOffset = null;
                    if (prevIndex >= 0) {
                      const listUpdate = cloneDeep(list);
                      prevItemOffset = richTextRefs.current[prevIndex].innerText.length;
                      listUpdate[prevIndex] = list[prevIndex] + item;
                      listUpdate.splice(index, 1);

                      onChange(listUpdate);
                    }

                    window.setTimeout(() => {
                      // Focus previous item
                      try {
                        if (prevIndex < richTextRefs.current.length) {
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
