<?php

define("ABSPATH", "let-me-in");
define("WP_DEBUG", true);

use LightnCandy\LightnCandy;

/**
 * Precompile handlebars templates
 */

function shadeColor($color, $shade)
{
    $num = base_convert(substr($color, 1), 16, 10);
    $amt = round(2.55 * $shade);
    $r = ($num >> 16) + $amt;
    $b = (($num >> 8) & 0x00ff) + $amt;
    $g = ($num & 0x0000ff) + $amt;

    return "#" .
        substr(
            base_convert(
                0x1000000 +
                    ($r < 255 ? ($r < 1 ? 0 : $r) : 255) * 0x10000 +
                    ($b < 255 ? ($b < 1 ? 0 : $b) : 255) * 0x100 +
                    ($g < 255 ? ($g < 1 ? 0 : $g) : 255),
                10,
                16
            ),
            1
        );
}

function precompileTemplate(
    $templatePath,
    $rendererPath,
    $handlebarsHelper = [],
    $handlebarsPartialPaths = []
) {

    $template = file_get_contents($templatePath);

    $handlebarsPartials = array_map(function ($path) {
        return file_get_contents($path);
    }, $handlebarsPartialPaths);

    $phpStr = LightnCandy::compile($template, [
        "flags" => LightnCandy::FLAG_HANDLEBARSJS | LightnCandy::FLAG_ERROR_EXCEPTION,
        "helpers" => $handlebarsHelper,
        "partials" => $handlebarsPartials,
    ]);

    // Save the compiled PHP code into a php file
    file_put_contents($rendererPath, "<?php " . $phpStr . "?>");
}

// Recipe block
precompileTemplate(
    dirname(__FILE__) . "/../src/blocks/recipe/block.hbs",
    dirname(__FILE__) . "/../build/recipe-block-renderer.php",
    [
        "formatDuration" => function ($context) {
            if (isset($context) && $context !== "") {
                $minutes = intval($context);

                if ($minutes < 60) {
                    return $minutes . " " . __("minutes", "recipe-creator");
                } else {
                    $hours = floor($minutes / 60);
                    $rest = $minutes % 60;

                    return $hours .
                        " " .
                        __("hours", "recipe-creator") .
                        ($rest > 0 ? " " . $rest . " " . __("minutes", "recipe-creator") : "");
                }
            }

            return "";
        },
        "toJSON" => function ($context) {
            return json_encode($context);
        },
        "ifOneOfThem" => function ($arg1, $arg2, $options) {
            if ((isset($arg1) && !empty($arg1)) || (isset($arg2) && !empty($arg2))) {
                return $options["fn"]();
            } else {
                return $options["inverse"]();
            }
        },
        "encode" => function ($context, $options) {
            return urlencode($context);
        },
        "shade" => function ($color, $shade, $options) {
            return shadeColor($color, $shade);
        },
        "ifMoreOrEqual" => function ($arg1, $arg2, $options) {
            if ($arg1 >= $arg2) {
                return $options["fn"]();
            } else {
                return $options["inverse"]();
            }
        },
        "isEven" => function ($conditional, $options) {
            if ($conditional % 2 === 0) {
                return $options["fn"]();
            } else {
                return $options["inverse"]();
            }
        },
    ],
    [
        "styleBlock" => dirname(__FILE__) . "/../src/blocks/recipe/style-block.hbs",
    ]
);

// Jump to recipe block
precompileTemplate(
    dirname(__FILE__) . "/../src/blocks/jump-to-recipe/template.hbs",
    dirname(__FILE__) . "/../build/jump-to-recipe-block-renderer.php"
);

// Recipe Block Styles
precompileTemplate(
    dirname(__FILE__) . "/../src/blocks/recipe/style-block.hbs",
    dirname(__FILE__) . "/../build/recipe-block-styles-renderer.php",
    [
        "encode" => function ($context) {
            return urlencode($context);
        },
        "shade" => function ($color, $shade) {
            return shadeColor($color, $shade);
        },
    ]
);
