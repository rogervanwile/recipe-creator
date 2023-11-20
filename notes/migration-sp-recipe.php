<?php

class RecipeCreatorMigrationSPRecipes
{
    public function getRecipeFromSP()
    {
        global $pagenow;

        if ($pagenow == "post.php" || get_post_type() == "post") {
            $postId = $_GET["post"];

            if ($postId) {
                $postMeta = get_post_meta($postId);
                return $this->extractRecipeFromMeta($postMeta);
            }
        }

        return null;
    }

    private function extractRecipeFromMeta($meta)
    {
        $recipe = [];

        foreach ($meta as $key => $value) {
            switch ($key) {
                case "sp-recipe-title":
                    $recipe["name"] = $value[0];
                    break;
                case "sp-recipe-description":
                    $recipe["description"] = $value[0];
                    break;
                case "sp-recipe-servings":
                    $recipe["recipeYield"] = $value[0];
                    break;
                case "sp-recipe-time-prep":
                    $recipe["prepTime"] = strval(intval($value[0]));
                    break;
                case "sp-recipe-time":
                    $recipe["cookTime"] = strval(intval($value[0]));
                    break;
                case "sp-recipe-time-total":
                    $recipe["totalTime"] = strval(intval($value[0]));
                    break;
                case "sp-recipe-cuisine":
                    $recipe["recipeCuisine"] = $value[0];
                    break;
                case "sp-recipe-ingredients":
                    $recipe["ingredients"] = $this->arrayToLi(array_map("trim", explode(PHP_EOL, $value[0])));
                    break;
                case "sp-recipe-method":
                    $recipe["preparationSteps"] = $this->arrayToLi(array_map("trim", explode(PHP_EOL, $value[0])));
                    break;
                case "sp-recipe-calories":
                    $recipe["calories"] = $value[0];
                    break;
                case "sp-recipe-notes":
                    $recipe["notes"] = $value[0];
                    break;
            }
        }

        return $recipe;
    }

    private function arrayToLi($array)
    {
        return "<li>" . implode("</li><li>", $array) . "</li>";
    }

    private function getPropertyFromRecipe($recipe, $property, $type = "string")
    {
        if (isset($recipe) && isset($recipe[$property])) {
            if ($type === "string") {
                return $recipe[$property] . "::STORE_DEFAULT_VALUE_HACK";
            } else {
                return intval($recipe[$property]) . "::STORE_DEFAULT_VALUE_NUMBER_HACK";
            }
        } else {
            if ($type === "string") {
                return "";
            } else {
                return 0;
            }
        }
    }

    // register_block_type('recipe-creator/recipe', array(
    //     'editor_script' => 'recipe-creator-recipe-block-editor',
    //     'editor_style'  => 'recipe-creator-recipe-block-editor',
    //     'script'        => 'recipe-creator-recipe-block',
    //     'style'         => 'recipe-creator-recipe-block',
    //     'attributes' => array(
    //         'ingredients' => array(
    //             'type' => 'string',
    //             'default' => $this->getPropertyFromRecipe($recipe, 'ingredients')
    //         ),
    //         'ingredientsLists' => array(
    //             'type' => 'array',
    //             'default' => [
    //                 [
    //                     "title" => "",
    //                     "list" => ""
    //                 ]
    //             ]
    //         ),
    //         'preparationSteps' => array(
    //             'type' => 'string',
    //             'default' => $this->getPropertyFromRecipe($recipe, 'preparationSteps')
    //         ),
    //         'name' => array(
    //             'type' => 'string',
    //             'default' => $this->getPropertyFromRecipe($recipe, 'name')
    //         ),
    //         'description' => array(
    //             'type' => 'string',
    //             'default' => $this->getPropertyFromRecipe($recipe, 'description')
    //         ),
    //         'difficulty' => array(
    //             'type' => 'string'
    //         ),
    //         'notes' => array(
    //             'type' => 'string',
    //             'default' => $this->getPropertyFromRecipe($recipe, 'notes')
    //         ),
    //         'prepTime' => array(
    //             'type' => 'string',
    //             'default' => $this->getPropertyFromRecipe($recipe, 'prepTime')
    //         ),
    //         'restTime' => array(
    //             'type' => 'string',
    //             'default' => $this->getPropertyFromRecipe($recipe, 'restTime')
    //         ),
    //         'cookTime' => array(
    //             'type' => 'string',
    //             'default' => $this->getPropertyFromRecipe($recipe, 'cookTime')
    //         ),
    //         'bakingTime' => array(
    //             'type' => 'string',
    //             'default' => ''
    //         ),
    //         'totalTime' => array(
    //             'type' => 'string',
    //             'default' => $this->getPropertyFromRecipe($recipe, 'totalTime')
    //         ),
    //         'recipeYield' => array(
    //             'type' => 'string',
    //             'default' => '0'
    //         ),
    //         'recipeYieldUnit' => array(
    //             'type' => 'string',
    //             'default' => ''
    //         ),
    //         'videoUrl' => array(
    //             'type' => 'string',
    //             'default' => ''
    //         ),
    //         'videoIframeUrl' => array(
    //             'type' => 'string',
    //             'default' => ''
    //         ),
    //         // DEPRECATED, löschen wenn Isas Blog durch ist
    //         'servings' => array(
    //             'type' => 'string',
    //             'default' => $this->getPropertyFromRecipe($recipe, 'recipeYield')
    //         ),
    //         'calories' => array(
    //             'type' => 'string',
    //             'default' => $this->getPropertyFromRecipe($recipe, 'calories')
    //         ),
    //         'recipeCuisine' => array(
    //             'type' => 'string',
    //             'default' => $this->getPropertyFromRecipe($recipe, 'recipeCuisine')
    //         ),
    //         'image1_1' => array(
    //             'type' => 'string',
    //             'default' => $this->getPropertyFromRecipe($recipe, 'image1_1')
    //         ),
    //         'image1_1Id' => array(
    //             'type' => 'number'
    //         ),
    //         'image3_2' => array(
    //             'type' => 'string',
    //             'default' => $this->getPropertyFromRecipe($recipe, 'image3_2')
    //         ),
    //         'image3_2Id' => array(
    //             'type' => 'number'
    //         ),
    //         'image4_3' => array(
    //             'type' => 'string',
    //             'default' => $this->getPropertyFromRecipe($recipe, 'image4_3')
    //         ),
    //         'image4_3Id' => array(
    //             'type' => 'number',
    //         ),
    //         'image16_9' => array(
    //             'type' => 'string',
    //             'default' => $this->getPropertyFromRecipe($recipe, 'image16_9')
    //         ),
    //         'image16_9Id' => array(
    //             'type' => 'number',
    //         ),
    //         'videoUrl' => array(
    //             'type' => 'string',
    //             'default' => $this->getPropertyFromRecipe($recipe, 'videoUrl')
    //         ),
    //         'content' => array(
    //             'type' => 'string',
    //             'default' => $this->getPropertyFromRecipe($recipe, 'content')
    //         ),
    //         'className' => array(
    //             'type' => 'string',
    //             'default' => $this->getPropertyFromRecipe($recipe, 'className')
    //         ),
    //         'align' => array(
    //             'type' => 'string',
    //             'default' => 'center'
    //         ),
    //     ),
    //     'render_callback' => array($this, 'renderRecipeBlock'),
    // ));
}
