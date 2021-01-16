<?php use \LightnCandy\SafeString as SafeString;use \LightnCandy\Runtime as LR;return function ($in = null, $options = null) {
    $helpers = array();
    $partials = array();
    $cx = array(
        'flags' => array(
            'jstrue' => true,
            'jsobj' => true,
            'jslen' => true,
            'spvar' => true,
            'prop' => false,
            'method' => false,
            'lambda' => false,
            'mustlok' => false,
            'mustlam' => false,
            'mustsec' => false,
            'echo' => false,
            'partnc' => false,
            'knohlp' => false,
            'debug' => isset($options['debug']) ? $options['debug'] : 1,
        ),
        'constants' => array(),
        'helpers' => isset($options['helpers']) ? array_merge($helpers, $options['helpers']) : $helpers,
        'partials' => isset($options['partials']) ? array_merge($partials, $options['partials']) : $partials,
        'scopes' => array(),
        'sp_vars' => isset($options['data']) ? array_merge(array('root' => $in), $options['data']) : array('root' => $in),
        'blparam' => array(),
        'partialid' => 0,
        'runtime' => '\LightnCandy\Runtime',
    );
    
    $inary=is_array($in);
    return '<style>
  .foodblogkitchen-toolkit--block.foodblogkitchen-toolkit--block {
    --headline-font-family: Luna-Regular, sans-serif;
    --headline-font-size: 32px;
    --headline-font-weight: normal;
    --sub-headline-font-size: 24px;
    --sub-headline-font-weight: normal;
    --background: '.LR::encq($cx, ((isset($in['options']) && is_array($in['options']) && isset($in['options']['backgroundColor'])) ? $in['options']['backgroundColor'] : null)).';
    --background-contrast: '.LR::encq($cx, ((isset($in['options']) && is_array($in['options']) && isset($in['options']['backgroundColorContrast'])) ? $in['options']['backgroundColorContrast'] : null)).';
    --secondary: '.LR::encq($cx, ((isset($in['options']) && is_array($in['options']) && isset($in['options']['secondaryColor'])) ? $in['options']['secondaryColor'] : null)).';
    --secondary-contrast: '.LR::encq($cx, ((isset($in['options']) && is_array($in['options']) && isset($in['options']['secondaryColorContrast'])) ? $in['options']['secondaryColorContrast'] : null)).';
    --primary: '.LR::encq($cx, ((isset($in['options']) && is_array($in['options']) && isset($in['options']['primaryColor'])) ? $in['options']['primaryColor'] : null)).';
    --primary-light: '.LR::encq($cx, ((isset($in['options']) && is_array($in['options']) && isset($in['options']['primaryColorLight'])) ? $in['options']['primaryColorLight'] : null)).';
    --primary-light-contrast: '.LR::encq($cx, ((isset($in['options']) && is_array($in['options']) && isset($in['options']['primaryColorLightContrast'])) ? $in['options']['primaryColorLightContrast'] : null)).';
    --primary-dark: '.LR::encq($cx, ((isset($in['options']) && is_array($in['options']) && isset($in['options']['primaryColorDark'])) ? $in['options']['primaryColorDark'] : null)).';


    --border-radius: '.LR::encq($cx, ((isset($in['options']) && is_array($in['options']) && isset($in['options']['borderRadius'])) ? $in['options']['borderRadius'] : null)).'px;
'.((LR::ifvar($cx, ((isset($in['options']) && is_array($in['options']) && isset($in['options']['showBoxShadow'])) ? $in['options']['showBoxShadow'] : null), false)) ? '    --box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
' : '    --box-shadow: none;
').'
'.((LR::ifvar($cx, ((isset($in['options']) && is_array($in['options']) && isset($in['options']['showBorder'])) ? $in['options']['showBorder'] : null), false)) ? '    --border: 1px solid '.LR::encq($cx, ((isset($in['options']) && is_array($in['options']) && isset($in['options']['primaryColor'])) ? $in['options']['primaryColor'] : null)).';
' : '    --border: 0px;
').'
'.((LR::ifvar($cx, (($inary && isset($in['svgs'])) ? $in['svgs'] : null), false)) ? '    --clock-url: url('.LR::raw($cx, ((isset($in['svgs']) && is_array($in['svgs']) && isset($in['svgs']['clock'])) ? $in['svgs']['clock'] : null)).');
    --star-url: url('.LR::raw($cx, ((isset($in['svgs']) && is_array($in['svgs']) && isset($in['svgs']['star'])) ? $in['svgs']['star'] : null)).');
    --star-filled-url: url('.LR::raw($cx, ((isset($in['svgs']) && is_array($in['svgs']) && isset($in['svgs']['starFilled'])) ? $in['svgs']['starFilled'] : null)).');
    --star-half-filled-url: url('.LR::raw($cx, ((isset($in['svgs']) && is_array($in['svgs']) && isset($in['svgs']['starHalfFilled'])) ? $in['svgs']['starHalfFilled'] : null)).');
    --star-highlighted-url: url('.LR::raw($cx, ((isset($in['svgs']) && is_array($in['svgs']) && isset($in['svgs']['starHighlighted'])) ? $in['svgs']['starHighlighted'] : null)).');
' : '').'  }
</style>';
};?>