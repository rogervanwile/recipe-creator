import { __ } from "@wordpress/i18n";
import { RichText } from "@wordpress/block-editor";
import { useRef, useEffect, useState } from "@wordpress/element";
import { cloneDeep } from "lodash";

export default function RichTextList({ list, onChange, placeholder, tagName = "ul" }) {
  const richTextRefs = useRef([]);
  const [backspaceCounter, setBackspaceCounter] = useState(0);

  useEffect(() => {
    console.log("list", list);
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

  function removeItem(index) {
    if (typeof list[index] !== "undefined") {
      const update = cloneDeep(list);
      update.splice(index, 1);

      onChange(update);
    }
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

                  // Focus next item
                  requestAnimationFrame(() => {
                    const nextIndex = index + 1;
                    if (richTextRefs.current[nextIndex]) {
                      richTextRefs.current[nextIndex].focus();
                    }
                  });
                }

                if (event.key === "Backspace" && item === "") {
                  // TODO: Wenn das Item direkt am Anfang leer ist, muss man aktuell 2 mal Backspace drücken
                  if (backspaceCounter > 0) {
                    removeItem(index);

                    // Focus previous item
                    const prevIndex = index - 1;
                    if (prevIndex < richTextRefs.current.length) {
                      const richTextElementToFocus = richTextRefs.current[prevIndex];
                      richTextElementToFocus.focus();

                      // Focus at the end of the input
                      const range = document.createRange();
                      const selection = window.getSelection();
                      range.setStart(richTextElementToFocus, richTextElementToFocus.childNodes.length);
                      range.collapse(true);
                      selection.removeAllRanges();
                      selection.addRange(range);
                    }
                  } else {
                    setBackspaceCounter(backspaceCounter + 1);
                  }
                }

                if (event.key !== "Backspace") {
                  setBackspaceCounter(0);
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
