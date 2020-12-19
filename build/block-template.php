<?php use \LightnCandy\SafeString as SafeString;use \LightnCandy\Runtime as LR;return function ($in = null, $options = null) {
    $helpers = array(            'formatDuration' => function($context, $options) {
						if (isset($context) && $context !== '') {
							$minutes = intval($context);

							if ($minutes < 60) {
								return $minutes . ' ' . __('minutes', 'foodblogkitchen-recipes');
							} else {
								$hours = floor($minutes / 60);
								$rest = $minutes % 60;

								return $hours . ' ' . __('hours', 'foodblogkitchen-recipes') . ($rest > 0 ? ' ' . $rest . ' ' . __('minutes', 'foodblogkitchen-recipes') : '');
							}
						}

						return '';
					},
            'toJSON' => function($context, $options) {
						return json_encode($context);
					},
            'encode' => function($context, $options) {
						return urlencode($context);
					},
            'ifMoreOrEqual' => function($arg1, $arg2, $options) {
						if ($arg1 >= $arg2) {
							return $options['fn']();
						} else {
							return $options['inverse']();
						}
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
    return '<div class="foodblogkitchen-recipes--block'.((LR::ifvar($cx, (($inary && isset($in['align'])) ? $in['align'] : null), false)) ? ' align'.LR::encq($cx, (($inary && isset($in['align'])) ? $in['align'] : null)).'' : '').'">
'.((LR::ifvar($cx, (($inary && isset($in['name'])) ? $in['name'] : null), false)) ? '		<h2>'.LR::raw($cx, (($inary && isset($in['name'])) ? $in['name'] : null)).'</h2>
' : '').'	
	<div class="foodblogkitchen-recipes--block--intro">
		<div>
'.((LR::ifvar($cx, (($inary && isset($in['difficulty'])) ? $in['difficulty'] : null), false)) ? '				<span class="foodblogkitchen-recipes--block--difficulty">'.LR::encq($cx, (($inary && isset($in['difficulty'])) ? $in['difficulty'] : null)).'</span>
' : '').'
'.((LR::ifvar($cx, (($inary && isset($in['description'])) ? $in['description'] : null), false)) ? '				<p>'.LR::encq($cx, (($inary && isset($in['description'])) ? $in['description'] : null)).'</p>
' : '').''.((LR::ifvar($cx, (($inary && isset($in['averageRating'])) ? $in['averageRating'] : null), false)) ? '			<div class="foodblogkitchen-recipes--block--rating foodblogkitchen-recipes--block--rating--small">
				<ol>
					<li class="foodblogkitchen-recipes--block--star'.((LR::ifvar($cx, (($inary && isset($in['averageRating'])) ? $in['averageRating'] : null), false)) ? ' selected' : '').'" data-rating="1">1</li>
					<li class="foodblogkitchen-recipes--block--star'.LR::hbbch($cx, 'ifMoreOrEqual', array(array((($inary && isset($in['averageRating'])) ? $in['averageRating'] : null),2),array()), $in, false, function($cx, $in) {$inary=is_array($in);return ' selected';}, function($cx, $in) {$inary=is_array($in);return ''.LR::hbbch($cx, 'ifMoreOrEqual', array(array((($inary && isset($in['averageRating'])) ? $in['averageRating'] : null),1.5),array()), $in, false, function($cx, $in) {$inary=is_array($in);return ' half-selected';}).'';}).'" data-rating="2">2</li>
					<li class="foodblogkitchen-recipes--block--star'.LR::hbbch($cx, 'ifMoreOrEqual', array(array((($inary && isset($in['averageRating'])) ? $in['averageRating'] : null),3),array()), $in, false, function($cx, $in) {$inary=is_array($in);return ' selected';}, function($cx, $in) {$inary=is_array($in);return ''.LR::hbbch($cx, 'ifMoreOrEqual', array(array((($inary && isset($in['averageRating'])) ? $in['averageRating'] : null),2.5),array()), $in, false, function($cx, $in) {$inary=is_array($in);return ' half-selected';}).'';}).'" data-rating="3">3</li>
					<li class="foodblogkitchen-recipes--block--star'.LR::hbbch($cx, 'ifMoreOrEqual', array(array((($inary && isset($in['averageRating'])) ? $in['averageRating'] : null),4),array()), $in, false, function($cx, $in) {$inary=is_array($in);return ' selected';}, function($cx, $in) {$inary=is_array($in);return ''.LR::hbbch($cx, 'ifMoreOrEqual', array(array((($inary && isset($in['averageRating'])) ? $in['averageRating'] : null),3.5),array()), $in, false, function($cx, $in) {$inary=is_array($in);return ' half-selected';}).'';}).'" data-rating="4">4</li>
					<li class="foodblogkitchen-recipes--block--star'.LR::hbbch($cx, 'ifMoreOrEqual', array(array((($inary && isset($in['averageRating'])) ? $in['averageRating'] : null),5),array()), $in, false, function($cx, $in) {$inary=is_array($in);return ' selected';}, function($cx, $in) {$inary=is_array($in);return ''.LR::hbbch($cx, 'ifMoreOrEqual', array(array((($inary && isset($in['averageRating'])) ? $in['averageRating'] : null),4.5),array()), $in, false, function($cx, $in) {$inary=is_array($in);return ' half-selected';}).'';}).'" data-rating="5">5</li>
				</ol>
			</div>
' : '').'		</div>
		<div>
'.((LR::ifvar($cx, (($inary && isset($in['thumbnail'])) ? $in['thumbnail'] : null), false)) ? '        <div
          class="foodblogkitchen-recipes--block--main-image"
          style="background-image: url(\''.LR::encq($cx, (($inary && isset($in['thumbnail'])) ? $in['thumbnail'] : null)).'\');" title="'.LR::encq($cx, (($inary && isset($in['name'])) ? $in['name'] : null)).'"
        ></div>
' : '').'		</div>
	</div>

	<hr />

	<div class="foodblogkitchen-recipes--block--timing-list">
		<ul>
'.((LR::ifvar($cx, (($inary && isset($in['prepTime'])) ? $in['prepTime'] : null), false)) ? '			<li>
				<header>'.LR::encq($cx, ((isset($in['translations']) && is_array($in['translations']) && isset($in['translations']['prepTime'])) ? $in['translations']['prepTime'] : null)).':</header>
				<span>'.LR::hbbch($cx, 'formatDuration', array(array((($inary && isset($in['prepTime'])) ? $in['prepTime'] : null)),array()), $in, false, function($cx, $in) {$inary=is_array($in);return '';}).'</span>
			</li>
' : '').'
'.((LR::ifvar($cx, (($inary && isset($in['restTime'])) ? $in['restTime'] : null), false)) ? '			<li>
				<header>'.LR::encq($cx, ((isset($in['translations']) && is_array($in['translations']) && isset($in['translations']['restTime'])) ? $in['translations']['restTime'] : null)).':</header>
				<span>
				'.LR::hbbch($cx, 'formatDuration', array(array((($inary && isset($in['restTime'])) ? $in['restTime'] : null)),array()), $in, false, function($cx, $in) {$inary=is_array($in);return '';}).'</span>
			</li>
' : '').'
'.((LR::ifvar($cx, (($inary && isset($in['cookTime'])) ? $in['cookTime'] : null), false)) ? '			<li>
				<header>'.LR::encq($cx, ((isset($in['translations']) && is_array($in['translations']) && isset($in['translations']['cookTime'])) ? $in['translations']['cookTime'] : null)).':</header>
				<span>
				'.LR::hbbch($cx, 'formatDuration', array(array((($inary && isset($in['cookTime'])) ? $in['cookTime'] : null)),array()), $in, false, function($cx, $in) {$inary=is_array($in);return '';}).'</span>
			</li>
' : '').'
'.((LR::ifvar($cx, (($inary && isset($in['totalTime'])) ? $in['totalTime'] : null), false)) ? '			<li>
				<header>'.LR::encq($cx, ((isset($in['translations']) && is_array($in['translations']) && isset($in['translations']['totalTime'])) ? $in['translations']['totalTime'] : null)).':</header>
				<span>'.LR::hbbch($cx, 'formatDuration', array(array((($inary && isset($in['totalTime'])) ? $in['totalTime'] : null)),array()), $in, false, function($cx, $in) {$inary=is_array($in);return '';}).'</span>
			</li>
' : '').'		</ul>
	</div>

	<hr />

'.((LR::ifvar($cx, (($inary && isset($in['ingredients'])) ? $in['ingredients'] : null), false)) ? '		<div class="foodblogkitchen-recipes--block--headline">
			<h3>'.LR::encq($cx, ((isset($in['translations']) && is_array($in['translations']) && isset($in['translations']['ingredients'])) ? $in['translations']['ingredients'] : null)).'</h3>
'.((LR::ifvar($cx, (($inary && isset($in['recipeYield'])) ? $in['recipeYield'] : null), false)) ? '				<div class="foodblogkitchen-recipes--block--servings-editor">
				  <button type="button" class="btn btn-secondary recipe-shrink-servings">-</button>
				  <span disabled="disabled"><span class="recipe-servings">'.LR::encq($cx, (($inary && isset($in['recipeYield'])) ? $in['recipeYield'] : null)).'</span>
						'.LR::encq($cx, (($inary && isset($in['recipeYieldUnit'])) ? $in['recipeYieldUnit'] : null)).'
					</span>
				  <button type="button" class="btn btn-secondary recipe-increase-servings">+</button>
				</div>
' : '').'		</div>
		<table class="foodblogkitchen-recipes--block--ingredients">
			<tbody>
'.LR::sec($cx, (($inary && isset($in['ingredients'])) ? $in['ingredients'] : null), null, $in, true, function($cx, $in) {$inary=is_array($in);return '					<tr>
						<td class="foodblogkitchen-recipes--block--amount" data-recipe-base-amount="'.LR::encq($cx, (($inary && isset($in['baseAmount'])) ? $in['baseAmount'] : null)).'" data-recipe-base-unit="'.LR::encq($cx, (($inary && isset($in['baseUnit'])) ? $in['baseUnit'] : null)).'">'.LR::encq($cx, (($inary && isset($in['amount'])) ? $in['amount'] : null)).' '.LR::encq($cx, (($inary && isset($in['unit'])) ? $in['unit'] : null)).'</td>
						<td class="foodblogkitchen-recipes--block--ingredient">'.LR::raw($cx, (($inary && isset($in['ingredient'])) ? $in['ingredient'] : null)).'</td>
					</tr>
';}).'			</tbody>
		</table>
' : '').'
	<hr />

'.((LR::ifvar($cx, (($inary && isset($in['preparationSteps'])) ? $in['preparationSteps'] : null), false)) ? '		<div class="foodblogkitchen-recipes--block--headline">
			<h3>'.LR::encq($cx, ((isset($in['translations']) && is_array($in['translations']) && isset($in['translations']['preparationSteps'])) ? $in['translations']['preparationSteps'] : null)).'</h3>
		</div>
		<ol class="foodblogkitchen-recipes--block--preparation-steps">
			'.LR::raw($cx, (($inary && isset($in['preparationSteps'])) ? $in['preparationSteps'] : null)).'
		</ol>
' : '').'

'.((LR::ifvar($cx, (($inary && isset($in['notes'])) ? $in['notes'] : null), false)) ? '	<hr />

	<section>
		<header class="foodblogkitchen-recipes--block--headline">
			<h3>'.LR::encq($cx, ((isset($in['translations']) && is_array($in['translations']) && isset($in['translations']['notes'])) ? $in['translations']['notes'] : null)).'</h3>
		</header>
		<p>'.LR::encq($cx, (($inary && isset($in['notes'])) ? $in['notes'] : null)).'</p>
	</section>
' : '').'	
	<section class="foodblogkitchen-recipes--block--user-rating">
		<hr />
		<header class="foodblogkitchen-recipes--block--headline">
			<h3>'.LR::encq($cx, ((isset($in['translations']) && is_array($in['translations']) && isset($in['translations']['feedback'])) ? $in['translations']['feedback'] : null)).'</h3>
		</header>	
		<div class="foodblogkitchen-recipes--block--rating foodblogkitchen-recipes--block--interactive" data-post-id="'.LR::encq($cx, (($inary && isset($in['postId'])) ? $in['postId'] : null)).'" data-save-url="'.LR::encq($cx, (($inary && isset($in['ajaxUrl'])) ? $in['ajaxUrl'] : null)).'" data-nonce="'.LR::encq($cx, (($inary && isset($in['nonce'])) ? $in['nonce'] : null)).'">
			<ol>
				<li class="foodblogkitchen-recipes--block--star'.((LR::ifvar($cx, (($inary && isset($in['userRating'])) ? $in['userRating'] : null), false)) ? ' selected' : '').'" data-rating="1">1</li>
				<li class="foodblogkitchen-recipes--block--star'.LR::hbbch($cx, 'ifMoreOrEqual', array(array((($inary && isset($in['userRating'])) ? $in['userRating'] : null),2),array()), $in, false, function($cx, $in) {$inary=is_array($in);return ' selected';}, function($cx, $in) {$inary=is_array($in);return '';}).'" data-rating="2">2</li>
				<li class="foodblogkitchen-recipes--block--star'.LR::hbbch($cx, 'ifMoreOrEqual', array(array((($inary && isset($in['userRating'])) ? $in['userRating'] : null),3),array()), $in, false, function($cx, $in) {$inary=is_array($in);return ' selected';}, function($cx, $in) {$inary=is_array($in);return '';}).'" data-rating="3">3</li>
				<li class="foodblogkitchen-recipes--block--star'.LR::hbbch($cx, 'ifMoreOrEqual', array(array((($inary && isset($in['userRating'])) ? $in['userRating'] : null),4),array()), $in, false, function($cx, $in) {$inary=is_array($in);return ' selected';}, function($cx, $in) {$inary=is_array($in);return '';}).'" data-rating="4">4</li>
				<li class="foodblogkitchen-recipes--block--star'.LR::hbbch($cx, 'ifMoreOrEqual', array(array((($inary && isset($in['userRating'])) ? $in['userRating'] : null),5),array()), $in, false, function($cx, $in) {$inary=is_array($in);return ' selected';}, function($cx, $in) {$inary=is_array($in);return '';}).'" data-rating="5">5</li>
			</ol>
		</div>
	</section>
	<script>
		var FoodblogKitchenRecipes = FoodblogKitchenRecipes || {};
		FoodblogKitchenRecipes.config = {
			ajaxUrl: \''.LR::encq($cx, (($inary && isset($in['ajaxUrl'])) ? $in['ajaxUrl'] : null)).'\',
			nonce: \''.LR::encq($cx, (($inary && isset($in['nonce'])) ? $in['nonce'] : null)).'\'
		};
	</script>
	<script type="application/ld+json">
		'.LR::hbbch($cx, 'toJSON', array(array((($inary && isset($in['ldJson'])) ? $in['ldJson'] : null)),array()), $in, false, function($cx, $in) {$inary=is_array($in);return '';}).'
  </script>
'.((LR::ifvar($cx, (($inary && isset($in['options'])) ? $in['options'] : null), false)) ? '
'.'		<style>
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
'.((LR::ifvar($cx, ((isset($in['options']) && is_array($in['options']) && isset($in['options']['showBoxShadow'])) ? $in['options']['showBoxShadow'] : null), false)) ? '		    --box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
' : '		    --box-shadow: none;
').'		
'.((LR::ifvar($cx, ((isset($in['options']) && is_array($in['options']) && isset($in['options']['showBorder'])) ? $in['options']['showBorder'] : null), false)) ? '		    --border: 1px solid '.LR::encq($cx, ((isset($in['options']) && is_array($in['options']) && isset($in['options']['primaryColor'])) ? $in['options']['primaryColor'] : null)).';
' : '		    --border: 0px;
').'		
		    --clock-url: url("data:image/svg+xml;utf8,<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" stroke-width=\\"2\\" stroke=\\"'.LR::encq($cx, LR::hbch($cx, 'encode', array(array(((isset($in['options']) && is_array($in['options']) && isset($in['options']['backgroundColorContrast'])) ? $in['options']['backgroundColorContrast'] : null)),array()), 'encq', $in)).'\\" fill=\\"none\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><path stroke=\\"none\\" d=\\"M0 0h24v24H0z\\" fill=\\"none\\"/><circle cx=\\"12\\" cy=\\"12\\" r=\\"9\\" /><polyline points=\\"12 7 12 12 15 15\\" /></svg>");
		    --star-url: url("data:image/svg+xml;utf8,<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"'.LR::encq($cx, LR::hbch($cx, 'encode', array(array(((isset($in['options']) && is_array($in['options']) && isset($in['options']['primaryColor'])) ? $in['options']['primaryColor'] : null)),array()), 'encq', $in)).'\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><polygon points=\\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\\"></polygon></svg>");
		    --star-filled-url: url("data:image/svg+xml;utf8,<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"'.LR::encq($cx, LR::hbch($cx, 'encode', array(array(((isset($in['options']) && is_array($in['options']) && isset($in['options']['primaryColor'])) ? $in['options']['primaryColor'] : null)),array()), 'encq', $in)).'\\" stroke=\\"'.LR::encq($cx, LR::hbch($cx, 'encode', array(array(((isset($in['options']) && is_array($in['options']) && isset($in['options']['primaryColor'])) ? $in['options']['primaryColor'] : null)),array()), 'encq', $in)).'\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><polygon points=\\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\\"></polygon></svg>");
		    --star-half-filled-url: url("data:image/svg+xml;utf8,<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"url(%23half_grad)\\" stroke=\\"'.LR::encq($cx, LR::hbch($cx, 'encode', array(array(((isset($in['options']) && is_array($in['options']) && isset($in['options']['primaryColor'])) ? $in['options']['primaryColor'] : null)),array()), 'encq', $in)).'\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><defs><linearGradient id=\\"half_grad\\"><stop offset=\\"50%\\" stop-color=\\"'.LR::encq($cx, LR::hbch($cx, 'encode', array(array(((isset($in['options']) && is_array($in['options']) && isset($in['options']['primaryColor'])) ? $in['options']['primaryColor'] : null)),array()), 'encq', $in)).'\\"/><stop offset=\\"50%\\" stop-color=\\"transparent\\" stop-opacity=\\"1\\" /></linearGradient></defs><polygon points=\\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\\"></polygon></svg>");
		    --star-highlighted-url: url("data:image/svg+xml;utf8,<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"'.LR::encq($cx, LR::hbch($cx, 'encode', array(array(((isset($in['options']) && is_array($in['options']) && isset($in['options']['primaryColorDark'])) ? $in['options']['primaryColorDark'] : null)),array()), 'encq', $in)).'\\" stroke=\\"'.LR::encq($cx, LR::hbch($cx, 'encode', array(array(((isset($in['options']) && is_array($in['options']) && isset($in['options']['primaryColorDark'])) ? $in['options']['primaryColorDark'] : null)),array()), 'encq', $in)).'\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><polygon points=\\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\\"></polygon></svg>");
		  }
		</style>'.'
' : '').'</div>
';
};?>