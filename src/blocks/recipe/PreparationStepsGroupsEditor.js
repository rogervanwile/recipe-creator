import { __ } from "@wordpress/i18n";
import { RichText } from "@wordpress/block-editor";
import { Button } from "@wordpress/components";
import RichTextList from "./RichTextList";
import { cloneDeep } from "lodash";

export default function PreparationStepsGroupsEditor({ props }) {
  function addGroup() {
    const update = [
      ...props.attributes.preparationStepsGroups,
      {
        title: "",
        list: "",
      },
    ];
    props.setAttributes({ preparationStepsGroups: update });

    return false;
  }

  function removeGroup(index) {
    if (props.attributes.preparationStepsGroups[index]) {
      if (confirm(__("Are you shure you want to delete this group? All steps will be deleted.", "recipe-creator"))) {
        const update = cloneDeep(props.attributes.preparationStepsGroups);
        update.splice(index, 1);

        if (update.length === 0) {
          update.push({
            title: "",
            list: "",
          });
        } else if (update.length === 1) {
          // If the length is now 1, the title must be reset to an empty string
          update[0].title = "";
        }

        props.setAttributes({ preparationStepsGroups: update });
      }
    }

    return false;
  }

  return (
    <>
      {props.attributes.preparationStepsGroups.map((group, groupIndex) => {
        return (
          <div key={"preparationStepsGroups_" + groupIndex} className="recipe-creator--recipe-block--editor">
            {groupIndex !== 0 || props.attributes.preparationStepsGroups.length > 1 ? (
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

                    const update = cloneDeep(props.attributes.preparationStepsGroups);
                    update[groupIndex] = groupUpdate;

                    props.setAttributes({ preparationStepsGroups: update });
                  }}
                />
                <Button variant="tertiary" onClick={() => removeGroup(groupIndex)}>
                  {__("Remove Group", "recipe-creator")}
                </Button>
              </div>
            ) : (
              ""
            )}

            <RichTextList
              tagName="ol"
              list={group.list}
              onChange={(value) => {
                const update = cloneDeep(props.attributes.preparationStepsGroups);
                update[groupIndex].list = value;

                props.setAttributes({ preparationStepsGroups: update });
              }}
              placeholder={__("Add the steps of preparation here...", "recipe-creator")}
            />
          </div>
        );
      })}

      <Button variant="secondary" onClick={addGroup}>
        {props.attributes.preparationStepsGroups.length === 1
          ? __("Split steps into groups", "recipe-creator")
          : __("Add additional group", "recipe-creator")}
      </Button>
    </>
  );
}
