<?php use \LightnCandy\SafeString as SafeString;use \LightnCandy\Runtime as LR;return function ($in = null, $options = null) {
    $helpers = array(            'formatDuration' => function($context, $options) {
						if (isset($context) && $context !== '') {
							$minutes = intval($context);

							if ($minutes < 60) {
								return $minutes . ' ' . __('minutes', 'recipe-manager-pro');
							} else {
								$hours = floor($minutes / 60);
								$rest = $minutes % 60;

								return $hours . ' ' . __('hours', 'recipe-manager-pro') . ($rest > 0 ? ' ' . $rest . ' ' . __('minutes', 'recipe-manager-pro') : '');
							}
						}

						return '';
					},
            'toJSON' => function($context, $options) {
						return json_encode($context);
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
    return '<div class="recipe-manager-pro--block'.((LR::ifvar($cx, (($inary && isset($in['align'])) ? $in['align'] : null), false)) ? ' align'.LR::encq($cx, (($inary && isset($in['align'])) ? $in['align'] : null)).'' : '').'">
'.((LR::ifvar($cx, (($inary && isset($in['name'])) ? $in['name'] : null), false)) ? '		<h2>'.LR::raw($cx, (($inary && isset($in['name'])) ? $in['name'] : null)).'</h2>
' : '').'	
	<div class="recipe-manager-pro--block--intro">
		<div>
'.((LR::ifvar($cx, (($inary && isset($in['difficulty'])) ? $in['difficulty'] : null), false)) ? '				<span class="recipe-manager-pro--block--difficulty">'.LR::encq($cx, (($inary && isset($in['difficulty'])) ? $in['difficulty'] : null)).'</span>
' : '').'
'.((LR::ifvar($cx, (($inary && isset($in['description'])) ? $in['description'] : null), false)) ? '				<p>'.LR::encq($cx, (($inary && isset($in['description'])) ? $in['description'] : null)).'</p>
' : '').''.((LR::ifvar($cx, (($inary && isset($in['averageRating'])) ? $in['averageRating'] : null), false)) ? '			<div class="recipe-manager-pro--block--rating recipe-manager-pro--block--rating--small">
				<ol>
					<li class="recipe-manager-pro--block--star'.((LR::ifvar($cx, (($inary && isset($in['averageRating'])) ? $in['averageRating'] : null), false)) ? ' selected' : '').'" data-rating="1">1</li>
					<li class="recipe-manager-pro--block--star'.LR::hbbch($cx, 'ifMoreOrEqual', array(array((($inary && isset($in['averageRating'])) ? $in['averageRating'] : null),2),array()), $in, false, function($cx, $in) {$inary=is_array($in);return ' selected';}, function($cx, $in) {$inary=is_array($in);return ''.LR::hbbch($cx, 'ifMoreOrEqual', array(array((($inary && isset($in['averageRating'])) ? $in['averageRating'] : null),1.5),array()), $in, false, function($cx, $in) {$inary=is_array($in);return ' half-selected';}).'';}).'" data-rating="2">2</li>
					<li class="recipe-manager-pro--block--star'.LR::hbbch($cx, 'ifMoreOrEqual', array(array((($inary && isset($in['averageRating'])) ? $in['averageRating'] : null),3),array()), $in, false, function($cx, $in) {$inary=is_array($in);return ' selected';}, function($cx, $in) {$inary=is_array($in);return ''.LR::hbbch($cx, 'ifMoreOrEqual', array(array((($inary && isset($in['averageRating'])) ? $in['averageRating'] : null),2.5),array()), $in, false, function($cx, $in) {$inary=is_array($in);return ' half-selected';}).'';}).'" data-rating="3">3</li>
					<li class="recipe-manager-pro--block--star'.LR::hbbch($cx, 'ifMoreOrEqual', array(array((($inary && isset($in['averageRating'])) ? $in['averageRating'] : null),4),array()), $in, false, function($cx, $in) {$inary=is_array($in);return ' selected';}, function($cx, $in) {$inary=is_array($in);return ''.LR::hbbch($cx, 'ifMoreOrEqual', array(array((($inary && isset($in['averageRating'])) ? $in['averageRating'] : null),3.5),array()), $in, false, function($cx, $in) {$inary=is_array($in);return ' half-selected';}).'';}).'" data-rating="4">4</li>
					<li class="recipe-manager-pro--block--star'.LR::hbbch($cx, 'ifMoreOrEqual', array(array((($inary && isset($in['averageRating'])) ? $in['averageRating'] : null),5),array()), $in, false, function($cx, $in) {$inary=is_array($in);return ' selected';}, function($cx, $in) {$inary=is_array($in);return ''.LR::hbbch($cx, 'ifMoreOrEqual', array(array((($inary && isset($in['averageRating'])) ? $in['averageRating'] : null),4.5),array()), $in, false, function($cx, $in) {$inary=is_array($in);return ' half-selected';}).'';}).'" data-rating="5">5</li>
				</ol>
				'.LR::encq($cx, (($inary && isset($in['averageRating'])) ? $in['averageRating'] : null)).'
			</div>
' : '').'		</div>
		<div>
'.((LR::ifvar($cx, (($inary && isset($in['thumbnail'])) ? $in['thumbnail'] : null), false)) ? '        <div
          class="recipe-manager-pro--block--main-image"
          style="background-image: url(\''.LR::encq($cx, (($inary && isset($in['thumbnail'])) ? $in['thumbnail'] : null)).'\');" title="'.LR::encq($cx, (($inary && isset($in['name'])) ? $in['name'] : null)).'"
        ></div>
' : '').'		</div>
	</div>

	<hr />

	<div class="recipe-manager-pro--block--timing-list">
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

'.((LR::ifvar($cx, (($inary && isset($in['ingredients'])) ? $in['ingredients'] : null), false)) ? '		<div class="recipe-manager-pro--block--headline">
			<h3>'.LR::encq($cx, ((isset($in['translations']) && is_array($in['translations']) && isset($in['translations']['ingredients'])) ? $in['translations']['ingredients'] : null)).'</h3>
'.((LR::ifvar($cx, (($inary && isset($in['recipeYield'])) ? $in['recipeYield'] : null), false)) ? '				<div class="recipe-manager-pro--block--servings-editor">
				  <button type="button" class="btn btn-secondary recipe-shrink-servings">-</button>
				  <span disabled="disabled"><span class="recipe-servings">'.LR::encq($cx, (($inary && isset($in['recipeYield'])) ? $in['recipeYield'] : null)).'</span>
						'.LR::encq($cx, (($inary && isset($in['recipeYieldUnit'])) ? $in['recipeYieldUnit'] : null)).'
					</span>
				  <button type="button" class="btn btn-secondary recipe-increase-servings">+</button>
				</div>
' : '').'		</div>
		<table class="recipe-manager-pro--block--ingredients">
			<tbody>
'.LR::sec($cx, (($inary && isset($in['ingredients'])) ? $in['ingredients'] : null), null, $in, true, function($cx, $in) {$inary=is_array($in);return '					<tr>
						<td class="recipe-manager-pro--block--amount" data-recipe-base-amount="'.LR::encq($cx, (($inary && isset($in['baseAmount'])) ? $in['baseAmount'] : null)).'" data-recipe-base-unit="'.LR::encq($cx, (($inary && isset($in['baseUnit'])) ? $in['baseUnit'] : null)).'">'.LR::encq($cx, (($inary && isset($in['amount'])) ? $in['amount'] : null)).' '.LR::encq($cx, (($inary && isset($in['unit'])) ? $in['unit'] : null)).'</td>
						<td class="recipe-manager-pro--block--ingredient">'.LR::raw($cx, (($inary && isset($in['ingredient'])) ? $in['ingredient'] : null)).'</td>
					</tr>
';}).'			</tbody>
		</table>
' : '').'
	<hr />

'.((LR::ifvar($cx, (($inary && isset($in['preparationSteps'])) ? $in['preparationSteps'] : null), false)) ? '		<div class="recipe-manager-pro--block--headline">
			<h3>'.LR::encq($cx, ((isset($in['translations']) && is_array($in['translations']) && isset($in['translations']['preparationSteps'])) ? $in['translations']['preparationSteps'] : null)).'</h3>
		</div>
		<ol class="recipe-manager-pro--block--preparation-steps">
			'.LR::raw($cx, (($inary && isset($in['preparationSteps'])) ? $in['preparationSteps'] : null)).'
		</ol>
' : '').'

'.((LR::ifvar($cx, (($inary && isset($in['notes'])) ? $in['notes'] : null), false)) ? '	<hr />

	<section>
		<header class="recipe-manager-pro--block--headline">
			<h3>'.LR::encq($cx, ((isset($in['translations']) && is_array($in['translations']) && isset($in['translations']['notes'])) ? $in['translations']['notes'] : null)).'</h3>
		</header>
		<p>'.LR::encq($cx, (($inary && isset($in['notes'])) ? $in['notes'] : null)).'</p>
	</section>
' : '').'	
	<section class="recipe-manager-pro--block--user-rating">
		<hr />
		<header class="recipe-manager-pro--block--headline">
			<h3>'.LR::encq($cx, ((isset($in['translations']) && is_array($in['translations']) && isset($in['translations']['feedback'])) ? $in['translations']['feedback'] : null)).'</h3>
		</header>	
		<div class="recipe-manager-pro--block--rating recipe-manager-pro--block--interactive" data-post-id="'.LR::encq($cx, (($inary && isset($in['postId'])) ? $in['postId'] : null)).'" data-save-url="'.LR::encq($cx, (($inary && isset($in['ajaxUrl'])) ? $in['ajaxUrl'] : null)).'" data-nonce="'.LR::encq($cx, (($inary && isset($in['nonce'])) ? $in['nonce'] : null)).'">
			<ol>
				<li class="recipe-manager-pro--block--star'.((LR::ifvar($cx, (($inary && isset($in['userRating'])) ? $in['userRating'] : null), false)) ? ' selected' : '').'" data-rating="1">1</li>
				<li class="recipe-manager-pro--block--star'.LR::hbbch($cx, 'ifMoreOrEqual', array(array((($inary && isset($in['userRating'])) ? $in['userRating'] : null),2),array()), $in, false, function($cx, $in) {$inary=is_array($in);return ' selected';}, function($cx, $in) {$inary=is_array($in);return '';}).'" data-rating="2">2</li>
				<li class="recipe-manager-pro--block--star'.LR::hbbch($cx, 'ifMoreOrEqual', array(array((($inary && isset($in['userRating'])) ? $in['userRating'] : null),3),array()), $in, false, function($cx, $in) {$inary=is_array($in);return ' selected';}, function($cx, $in) {$inary=is_array($in);return '';}).'" data-rating="3">3</li>
				<li class="recipe-manager-pro--block--star'.LR::hbbch($cx, 'ifMoreOrEqual', array(array((($inary && isset($in['userRating'])) ? $in['userRating'] : null),4),array()), $in, false, function($cx, $in) {$inary=is_array($in);return ' selected';}, function($cx, $in) {$inary=is_array($in);return '';}).'" data-rating="4">4</li>
				<li class="recipe-manager-pro--block--star'.LR::hbbch($cx, 'ifMoreOrEqual', array(array((($inary && isset($in['userRating'])) ? $in['userRating'] : null),5),array()), $in, false, function($cx, $in) {$inary=is_array($in);return ' selected';}, function($cx, $in) {$inary=is_array($in);return '';}).'" data-rating="5">5</li>
			</ol>
		</div>
	</section>
	<script>
		var RecipeManagerPro = RecipeManagerPro || {};
		RecipeManagerPro.config = {
			ajaxUrl: \''.LR::encq($cx, (($inary && isset($in['ajaxUrl'])) ? $in['ajaxUrl'] : null)).'\',
			nonce: \''.LR::encq($cx, (($inary && isset($in['nonce'])) ? $in['nonce'] : null)).'\'
		};
	</script>
	<script type="application/ld+json">
		'.LR::hbbch($cx, 'toJSON', array(array((($inary && isset($in['ldJson'])) ? $in['ldJson'] : null)),array()), $in, false, function($cx, $in) {$inary=is_array($in);return '';}).'
  </script>
	<style>
		.recipe-manager-pro--block {
		  --headline-font-family: Luna-Regular, sans-serif;
		  --headline-font-size: 32px;
		  --headline-font-weight: normal;
		  --sub-headline-font-size: 24px;
		  --sub-headline-font-weight: normal;
		  --background: '.LR::encq($cx, ((isset($in['options']) && is_array($in['options']) && isset($in['options']['backgroundColor'])) ? $in['options']['backgroundColor'] : null)).';
		  --secondary: '.LR::encq($cx, ((isset($in['options']) && is_array($in['options']) && isset($in['options']['secondaryColor'])) ? $in['options']['secondaryColor'] : null)).';
		  --primary: '.LR::encq($cx, ((isset($in['options']) && is_array($in['options']) && isset($in['options']['primaryColor'])) ? $in['options']['primaryColor'] : null)).';
		  --primary-light: '.LR::encq($cx, ((isset($in['options']) && is_array($in['options']) && isset($in['options']['primaryColorLight'])) ? $in['options']['primaryColorLight'] : null)).';

			--star-url: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\''.LR::encq($cx, ((isset($in['options']) && is_array($in['options']) && isset($in['options']['primaryColorEncoded'])) ? $in['options']['primaryColorEncoded'] : null)).'\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' class=\'feather feather-star\'><polygon points=\'12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\'></polygon></svg>");
			--star-filled-url: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\''.LR::encq($cx, ((isset($in['options']) && is_array($in['options']) && isset($in['options']['primaryColorEncoded'])) ? $in['options']['primaryColorEncoded'] : null)).'\' stroke=\''.LR::encq($cx, ((isset($in['options']) && is_array($in['options']) && isset($in['options']['primaryColorEncoded'])) ? $in['options']['primaryColorEncoded'] : null)).'\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' class=\'feather feather-star\'><polygon points=\'12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\'></polygon></svg>");
			--star-half-filled-url: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'url(%23half_grad)\' stroke=\''.LR::encq($cx, ((isset($in['options']) && is_array($in['options']) && isset($in['options']['primaryColorEncoded'])) ? $in['options']['primaryColorEncoded'] : null)).'\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' class=\'feather feather-star\'><defs><linearGradient id=\'half_grad\'><stop offset=\'50%\' stop-color=\'%23e27a7a\'/><stop offset=\'50%\' stop-color=\'white\' stop-opacity=\'1\' /></linearGradient></defs><polygon points=\'12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\'></polygon></svg>");
			--star-highlighted-url: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\''.LR::encq($cx, ((isset($in['options']) && is_array($in['options']) && isset($in['options']['primaryColorDarkEncoded'])) ? $in['options']['primaryColorDarkEncoded'] : null)).'\' stroke=\''.LR::encq($cx, ((isset($in['options']) && is_array($in['options']) && isset($in['options']['primaryColorDarkEncoded'])) ? $in['options']['primaryColorDarkEncoded'] : null)).'\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' class=\'feather feather-star\'><polygon points=\'12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\'></polygon></svg>");
		}

	</style>
</div>
';
};?>