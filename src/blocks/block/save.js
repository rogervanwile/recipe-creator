/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
export default function save(props) {
	const getDurationFormatted = (duration) => {
		if (duration < 60) {
			return duration + " " + __("minutes", "recipe-manager-pro");
		} else {
			const hours = Math.floor(duration / 60);
			const minutes = duration % 60;

			return (
				hours +
				" " +
				__("hours", "recipe-manager-pro") +
				" " +
				minutes +
				" " +
				__("minutes", "recipe-manager-pro")
			);
		}
	};

	return (
		<div className={props.className}>
			{props.attributes.name && <h2>{props.attributes.name}</h2>}
			{props.attributes.description && <p>{props.attributes.description}</p>}
			<ul className="inline-list">
				{props.attributes.prepTime && (
					<li>
						{__("Prep time", "recipe-manager-pro")}:{" "}
						{getDurationFormatted(props.attributes.prepTime)}
					</li>
				)}
				{props.attributes.cookTime && (
					<li>
						{__("Cook time", "recipe-manager-pro")}:{" "}
						{getDurationFormatted(props.attributes.cookTime)}
					</li>
				)}
				{props.attributes.prepTime && props.attributes.cookTime && (
					<li>
						{__("Total time", "recipe-manager-pro")}:{" "}
						{getDurationFormatted(
							props.attributes.prepTime + props.attributes.cookTime
						)}
					</li>
				)}
				{props.attributes.recipeYield && (
					<li>
						{__("Result", "recipe-manager-pro")}:{props.attributes.recipeYield}
					</li>
				)}
			</ul>

			{props.attributes.ingredients && (
				<div>
					<h2>{__("Ingredients", "recipe-manager-pro")}</h2>
					<ul className="recipe-ingredients-list">
						{props.attributes.ingredients}
					</ul>
				</div>
			)}

			{props.attributes.preparationSteps && (
				<div>
					<h2>{__("Steps of preparation", "recipe-manager-pro")}</h2>
					<ol className="recipe-preparation-steps-list">
						{props.attributes.preparationSteps}
					</ol>
				</div>
			)}
		</div>
	);
}
