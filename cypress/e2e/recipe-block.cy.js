function checkRecipeBockScreenshot(name) {
  // Hide the admin bar
  cy.get("#wpadminbar").invoke("attr", "style", "display: none");

  // Add some CSS to reduce stitching errors
  cy.get("html")
    .invoke("css", "height", "initial")
    .invoke("css", "scroll-behavior", "auto");
  cy.get("body").invoke("css", "height", "initial");

  // Hide the video, it causes diffs in the screenshot
  cy.get(".recipe-plugin-for-wp--recipe-block--video-wrapper").invoke(
    "css",
    "display",
    "none"
  );

  // Take a screenshot and check if it looks like exected
  // cy.get(".recipe-plugin-for-wp--block").matchImageSnapshot(name);
}

describe("Tests the recipe block", () => {
  beforeEach(() => {
    // Not working:
    // cy.seed("ValidLicenseSeeder");

    cy.visit(
      "http://localhost/wp-admin/admin.php?page=recipe_plugin_for_wp_license"
    );
    cy.get("#recipe_plugin_for_wp__license_key").should("have.value", "");
    cy.get("#recipe_plugin_for_wp__license_key").type("5ff5cd22687bc");
    cy.get('[value="Activate"]').click();
    cy.contains("Your license has been successfully activated.");
  });

  after(() => {
    // Not working:
    // cy.seedClean("ValidLicenseSeeder");

    cy.visit(
      "http://localhost/wp-admin/admin.php?page=recipe_plugin_for_wp_license"
    );

    cy.get('[value="Deactivate"]').click();
    cy.contains("The license has been successfully deactivated.");
  });

  it.only("should be possible to enter a recipe with valid license", () => {
    cy.visit("http://localhost/wp-admin/post-new.php");
    cy.get(".block-editor-inserter > .components-button").click();
    cy.get(".block-editor-inserter__search input[type=search]").click();
    cy.get(".block-editor-inserter__search input[type=search]").type("Recipe");
    cy.get(".editor-block-list-item-recipe-plugin-for-wp--recipe").click();

    // Insert data into the block
    cy.get('[aria-label="Title of your recipe"]').type("Test Headline");
    cy.get(
      ".recipe-plugin-for-wp--recipe-block--difficulty:first-child"
    ).click();
    cy.get('[aria-label="Short description of your recipe"]').type(
      "Test description",
      { force: true }
    );
    cy.get(
      ".recipe-plugin-for-wp--recipe-block--timings li:nth-child(1) input"
    ).type("10", { force: true });
    cy.get(
      ".recipe-plugin-for-wp--recipe-block--timings li:nth-child(2) input"
    ).type("15", { force: true });
    cy.get(
      ".recipe-plugin-for-wp--recipe-block--timings li:nth-child(3) input"
    ).type("20", { force: true });
    cy.get(
      ".recipe-plugin-for-wp--recipe-block--timings li:nth-child(4) input"
    ).type("25", { force: true });
    cy.contains("70 Min.");
    cy.get(
      ".recipe-plugin-for-wp--recipe-block--flex-container input:nth-child(1)"
    )
      .clear()
      .type("4", { force: true });
    cy.get(
      ".recipe-plugin-for-wp--recipe-block--ingredients .recipe-plugin-for-wp--recipe-block--editor ul"
    ).type("3 bananans\n2 onions", { force: true });
    cy.get(
      ".recipe-plugin-for-wp--recipe-block--preparation-steps .recipe-plugin-for-wp--recipe-block--editor ol"
    ).type("Slice bananas\ntake the onions back", { force: true });
    cy.get(".recipe-plugin-for-wp--recipe-block--video input").type(
      "https://www.youtube.com/watch?v=tl2tYk54gOE",
      { force: true }
    );
    cy.get('[aria-label="Additional notes ..."]').type("Additional notes", {
      force: true,
    });

    // Save the Page
    cy.get(".editor-post-publish-button__button").click();
    cy.get(
      ".editor-post-publish-button.editor-post-publish-button__button"
    ).click();

    // Check the page
    cy.get(".post-publish-panel__postpublish-buttons a.is-primary").click();

    checkRecipeBockScreenshot("recipe-block");

    // cy.get('.recipe-plugin-for-wp--block').scrollIntoView();
    // cy.get('.recipe-plugin-for-wp--block').contains('Test Headline')
    // cy.get('.recipe-plugin-for-wp--block').contains('10 minutes')
    // cy.get('.recipe-plugin-for-wp--block').contains('15 minutes')
    // cy.get('.recipe-plugin-for-wp--block').contains('25 minutes')
    // cy.get('.recipe-plugin-for-wp--block').contains('1 hours 10 minutes')
    // cy.get('.recipe-plugin-for-wp--block').contains('3 bananans')
    // cy.get('.recipe-plugin-for-wp--block').contains('2 onions')
    // cy.get('.recipe-plugin-for-wp--block').contains('Slice bananas')
    // cy.get('.recipe-plugin-for-wp--block').contains('take the onions back')
    // cy.get('.recipe-plugin-for-wp--block').contains('Additional notes')
    // cy.get('.recipe-plugin-for-wp--block').contains('Print');

    // Check if the calculator works
    cy.get(".recipe-servings").scrollIntoView().contains("4");
    cy.get(".recipe-increase-servings").click({ force: true });
    cy.get(".recipe-servings").contains("5");
    cy.get(".recipe-plugin-for-wp--recipe-block").contains("2,5 onions");

    // Back to the editor
    cy.go("back");

    cy.get(".recipe-plugin-for-wp--recipe-block--ingredients button").click({
      force: true,
    });

    // First group
    cy.get(
      ".recipe-plugin-for-wp--recipe-block--flex-container + .recipe-plugin-for-wp--recipe-block--editor"
    )
      .find('[aria-label="Group name"]')
      .type("Group 1", { force: true });

    // Second group
    cy.get(
      ".recipe-plugin-for-wp--recipe-block--flex-container + .recipe-plugin-for-wp--recipe-block--editor + .recipe-plugin-for-wp--recipe-block--editor"
    )
      .find('[aria-label="Group name"]')
      .type("Group 2", { force: true });

    cy.get(
      ".recipe-plugin-for-wp--recipe-block--flex-container + .recipe-plugin-for-wp--recipe-block--editor + .recipe-plugin-for-wp--recipe-block--editor"
    )
      .find('[aria-label="Add the ingredients here..."]')
      .type("3 Bananas\n4 Garlic", { force: true });

    cy.get(".editor-post-publish-button__button").click();
    cy.get(".components-snackbar__action").click();

    checkRecipeBockScreenshot("recipe-block-with-groups");
  });
});
