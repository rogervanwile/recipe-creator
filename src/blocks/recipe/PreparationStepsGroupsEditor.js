import { __ } from "@wordpress/i18n";
import { RichText } from "@wordpress/block-editor";
import { Button } from "@wordpress/components";

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
      if (confirm(__("Are you shure you want to delete this group. All steps will be deleted."))) {
        const update = [...props.attributes.preparationStepsGroups];
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
      {props.attributes.preparationStepsGroups.map((group, index) => {
        return (
          <div key={"preparationStepsGroups_" + index} className="recipe-creator--recipe-block--editor">
            {index !== 0 || props.attributes.preparationStepsGroups.length > 1 ? (
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

                    const update = [...props.attributes.preparationStepsGroups];
                    update[index] = groupUpdate;

                    props.setAttributes({ preparationStepsGroups: update });
                  }}
                />
                <Button isTertiary={true} onClick={() => removeGroup(index)}>
                  {__("Remove Group", "recipe-creator")}
                </Button>
              </div>
            ) : (
              ""
            )}
            <RichText
              tagName="ol"
              multiline="li"
              placeholder={__("Add the steps of preparation here...", "recipe-creator")}
              value={group.list || ""}
              __unstablePastePlainText={true}
              onChange={(value) => {
                const groupUpdate = {
                  ...group,
                  list: value,
                };

                const update = [...props.attributes.preparationStepsGroups];
                update[index] = groupUpdate;

                props.setAttributes({ preparationStepsGroups: update });
              }}
            />
          </div>
        );
      })}

      <Button isSecondary={true} onClick={addGroup}>
        {props.attributes.preparationStepsGroups.length === 1
          ? __("Split steps into groups", "recipe-creator")
          : __("Add additional group", "recipe-creator")}
      </Button>
    </>
  );
}
