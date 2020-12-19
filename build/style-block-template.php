<?php use \LightnCandy\SafeString as SafeString;use \LightnCandy\Runtime as LR;return function ($in = null, $options = null) {
    $helpers = array(            'encode' => function($context, $options) {
						return urlencode($context);
					},
);
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
  .foodblogkitchen-recipes--block.foodblogkitchen-recipes--block {
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
    --clock-url: url("data:image/svg+xml;utf8,<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" stroke-width=\\"2\\" stroke=\\"'.LR::encq($cx, LR::hbch($cx, 'encode', array(array(((isset($in['options']) && is_array($in['options']) && isset($in['options']['backgroundColorContrast'])) ? $in['options']['backgroundColorContrast'] : null)),array()), 'encq', $in)).'\\" fill=\\"none\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><path stroke=\\"none\\" d=\\"M0 0h24v24H0z\\" fill=\\"none\\"/><circle cx=\\"12\\" cy=\\"12\\" r=\\"9\\" /><polyline points=\\"12 7 12 12 15 15\\" /></svg>");
    --star-url: url("data:image/svg+xml;utf8,<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"'.LR::encq($cx, LR::hbch($cx, 'encode', array(array(((isset($in['options']) && is_array($in['options']) && isset($in['options']['primaryColor'])) ? $in['options']['primaryColor'] : null)),array()), 'encq', $in)).'\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><polygon points=\\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\\"></polygon></svg>");
    --star-filled-url: url("data:image/svg+xml;utf8,<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"'.LR::encq($cx, LR::hbch($cx, 'encode', array(array(((isset($in['options']) && is_array($in['options']) && isset($in['options']['primaryColor'])) ? $in['options']['primaryColor'] : null)),array()), 'encq', $in)).'\\" stroke=\\"'.LR::encq($cx, LR::hbch($cx, 'encode', array(array(((isset($in['options']) && is_array($in['options']) && isset($in['options']['primaryColor'])) ? $in['options']['primaryColor'] : null)),array()), 'encq', $in)).'\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><polygon points=\\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\\"></polygon></svg>");
    --star-half-filled-url: url("data:image/svg+xml;utf8,<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"url(%23half_grad)\\" stroke=\\"'.LR::encq($cx, LR::hbch($cx, 'encode', array(array(((isset($in['options']) && is_array($in['options']) && isset($in['options']['primaryColor'])) ? $in['options']['primaryColor'] : null)),array()), 'encq', $in)).'\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><defs><linearGradient id=\\"half_grad\\"><stop offset=\\"50%\\" stop-color=\\"'.LR::encq($cx, LR::hbch($cx, 'encode', array(array(((isset($in['options']) && is_array($in['options']) && isset($in['options']['primaryColor'])) ? $in['options']['primaryColor'] : null)),array()), 'encq', $in)).'\\"/><stop offset=\\"50%\\" stop-color=\\"transparent\\" stop-opacity=\\"1\\" /></linearGradient></defs><polygon points=\\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\\"></polygon></svg>");
    --star-highlighted-url: url("data:image/svg+xml;utf8,<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"'.LR::encq($cx, LR::hbch($cx, 'encode', array(array(((isset($in['options']) && is_array($in['options']) && isset($in['options']['primaryColorDark'])) ? $in['options']['primaryColorDark'] : null)),array()), 'encq', $in)).'\\" stroke=\\"'.LR::encq($cx, LR::hbch($cx, 'encode', array(array(((isset($in['options']) && is_array($in['options']) && isset($in['options']['primaryColorDark'])) ? $in['options']['primaryColorDark'] : null)),array()), 'encq', $in)).'\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><polygon points=\\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\\"></polygon></svg>");
  }
</style>';
};?>