<?php

class Migration_2_3_0
{
    public function migrate()
    {
        $posts = $this->getPostsWithBlockName('recipe-creator/recipe');

        if (count($posts) === 0) {
            return false; // Must be false to handle Foodblog-Toolkit-Migrations
        }

        remove_action('save_post', [$this, "deleteTransientsOnPostSave"]);

        foreach ($posts as  $post) {
            $blocks = parse_blocks($post->post_content);

            $this->migrateRecipeBlocks($blocks);

            $post->post_content = serialize_blocks($blocks);

            wp_update_post($post, true, false);
        }

        add_action('save_post', [$this, "deleteTransientsOnPostSave"]);

        return true;
    }


    private function migrateRecipeBlocks(&$blocks)
    {
        foreach ($blocks as &$block) {
            if ($block['blockName'] === 'recipe-creator/recipe') {
                $this->migrateRecipeBlock($block);
            } else if (!empty($block['innerBlocks']) && count($block['innerBlocks'])) {
                $block['innerBlocks'] = $this->migrateRecipeBlocks($block['innerBlocks']);
            }
        }

        return $blocks;
    }


    private function getPostsWithBlockName($blockName)
    {
        $args = array(
            'post_type' => get_post_types(),
            'posts_per_page' => -1,
            's' => $blockName,
            'post_status' => 'any',
            'search_columns' => array('post_content'),
        );

        return  get_posts($args);
    }

    private function migrateRecipeBlock(&$old)
    {
        if (isset($old["attrs"]['utensils']) && is_string($old["attrs"]['utensils'])) {
            $old["attrs"]['utensils'] = $this->liStringToArray($old["attrs"]['utensils']);
        }

        if (isset($old["attrs"]['ingredientsGroups']) && is_array($old["attrs"]['ingredientsGroups'])) {
            $old["attrs"]['ingredientsGroups'] = array_map(function ($group) {
                if (isset($group['list']) && is_string($group['list'])) {
                    $group['list'] = $this->liStringToArray($group['list']);
                }
                return $group;
            }, $old["attrs"]['ingredientsGroups']);
        }

        if (isset($old["attrs"]['preparationStepsGroups']) && is_array($old["attrs"]['preparationStepsGroups'])) {
            $old["attrs"]['preparationStepsGroups'] = array_map(function ($group) {
                if (isset($group['list']) && is_string($group['list'])) {
                    $group['list'] = $this->liStringToArray($group['list']);
                }
                return $group;
            }, $old["attrs"]['preparationStepsGroups']);
        }
    }

    private function liStringToArray($liString)
    {
        $liArray = explode("</li><li>", $liString);
        $liArray = array_map(function ($item) {
            $result = str_replace(["<li>", "</li>"], "", $item);
            return $result;
        }, $liArray);

        return $liArray;
    }
}
