import { __ } from "@wordpress/i18n";
import { RichText } from "@wordpress/block-editor";
import { Button } from "@wordpress/components";
import RichTextList from "./RichTextList";
import { cloneDeep } from "lodash";

export default function IngredientsGroupsEditor({ props }) {
  function addGroup() {
    const update = [
      ...props.attributes.ingredientsGroups,
      {
        title: "",
        list: [""],
      },
    ];
    props.setAttributes({ ingredientsGroups: update });

    return false;
  }

  function removeGroup(index) {
    if (props.attributes.ingredientsGroups[index]) {
      if (
        confirm(__("Are you shure you want to delete this group? All ingredients will be deleted.", "recipe-creator"))
      ) {
        const update = cloneDeep(props.attributes.ingredientsGroups);
        update.splice(index, 1);

        if (update.length === 0) {
          update.push({
            title: "",
            list: [""],
          });
        } else if (update.length === 1) {
          // If the length is now 1, the title must be reset to an empty string
          update[0].title = "";
        }

        props.setAttributes({ ingredientsGroups: update });
      }
    }

    return false;
  }

  return (
    <>
      {props.attributes.ingredientsGroups.map((group, groupIndex) => {
        return (
          <div key={"ingredientsGroups_" + groupIndex} className="recipe-creator--recipe-block--editor">
            {groupIndex !== 0 || props.attributes.ingredientsGroups.length > 1 ? (
              <div className="recipe-creator--recipe-block--group-header">
                <RichText
                  tagName="h3"
                  value={group.title || ""}
                  placeholder={__("Group name", "recipe-creator")}
                  __unstablePastePlainText={true}
                  onChange={(value) => {
                    const groupUpdate = {
                      ...group,
                      title: value,
                    };

                    const update = cloneDeep(props.attributes.ingredientsGroups);
                    update[groupIndex] = groupUpdate;

                    props.setAttributes({ ingredientsGroups: update });
                  }}
                />
                <Button variant="tertiary" onClick={() => removeGroup(groupIndex)}>
                  {__("Remove Group", "recipe-creator")}
                </Button>
              </div>
            ) : (
              ""
            )}
            {/* TODO: Herausfinden warum das erst beim hinzufügen eine Gruppe gespeichert wird */}
            <RichTextList
              list={group.list}
              onChange={(value) => {
                const update = cloneDeep(props.attributes.ingredientsGroups);
                update[groupIndex].list = value;

                props.setAttributes({ ingredientsGroups: update });
              }}
              placeholder={__("Add the ingredients here...", "recipe-creator")}
            />
          </div>
        );
      })}

      <Button variant="secondary" onClick={addGroup}>
        {props.attributes.ingredientsGroups.length === 1
          ? __("Split ingredients into groups", "recipe-creator")
          : __("Add additional group", "recipe-creator")}
      </Button>
    </>
  );
}
