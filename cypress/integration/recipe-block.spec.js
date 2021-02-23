function checkRecipeBockScreenshot(name) {
    // Hide the admin bar
    cy.get('#wpadminbar').invoke('attr', 'style', 'display: none')

    // Add some CSS to reduce stitching errors
    cy.get('html').invoke('css', 'height', 'initial').invoke('css', 'scroll-behavior', 'auto');
    cy.get('body').invoke('css', 'height', 'initial');

    // Hide the video, it causes diffs in the screenshot
    cy.get('.foodblogkitchen-toolkit--recipe-block--video-wrapper').invoke('css', 'display', 'none');

    // Take a screenshot and check if it looks like exected
    cy.get('.foodblogkitchen-toolkit--block')
        .matchImageSnapshot(name);
}

describe('Tests the recipe block', () => {
    beforeEach(() => {
        cy.seed('ValidLicenseSeeder');
    });

    it.only('should be possible to enter a recipe with valid license', () => {
        cy.visit('http://localhost/wp-admin/post-new.php');
        cy.get('.wp-block > .components-dropdown > .components-button').click();
        cy.get('#block-editor-inserter__search-0').click();
        cy.get('#block-editor-inserter__search-0').type('Recipe');
        cy.get('.editor-block-list-item-foodblogkitchen-recipes-block').click();

        // Insert data into the block
        cy.get('[aria-label="Title of your recipe"]').type('Test Headline');
        cy.get('.foodblogkitchen-toolkit--recipe-block--difficulty:first-child').click();
        cy.get('[aria-label="Short description of your recipe"]').type('Test description', { force: true });
        cy.get('.foodblogkitchen-toolkit--recipe-block--timing-list li:nth-child(1) input').type('10', { force: true });
        cy.get('.foodblogkitchen-toolkit--recipe-block--timing-list li:nth-child(2) input').type('15', { force: true });
        cy.get('.foodblogkitchen-toolkit--recipe-block--timing-list li:nth-child(3) input').type('20', { force: true });
        cy.get('.foodblogkitchen-toolkit--recipe-block--timing-list li:nth-child(4) input').type('25', { force: true });
        cy.contains('70 Min.');
        cy.get('.foodblogkitchen-toolkit--recipe-block--flex-container input:nth-child(1)').type('4', { force: true });
        cy.get('.foodblogkitchen-toolkit--recipe-block--ingredients > ul').type('3 bananans\n2 onions', { force: true });
        cy.get('.foodblogkitchen-toolkit--recipe-block--preparation-steps > ol').type('Slice bananas\ntake the onions back', { force: true });
        cy.get('.foodblogkitchen-toolkit--recipe-block--video input').type('https://www.youtube.com/watch?v=tl2tYk54gOE', { force: true });
        cy.get('[aria-label="Additional notes ..."]').type('Additional notes', { force: true });

        // Save the Page
        cy.get('.editor-post-publish-button__button').click();
        cy.get('.editor-post-publish-button.editor-post-publish-button__button').click();

        // Check the page
        cy.get('.post-publish-panel__postpublish-buttons a').click();

        checkRecipeBockScreenshot('recipe-block');

        // cy.get('.foodblogkitchen-toolkit--block').scrollIntoView();
        // cy.get('.foodblogkitchen-toolkit--block').contains('Test Headline')
        // cy.get('.foodblogkitchen-toolkit--block').contains('10 minutes')
        // cy.get('.foodblogkitchen-toolkit--block').contains('15 minutes')
        // cy.get('.foodblogkitchen-toolkit--block').contains('25 minutes')
        // cy.get('.foodblogkitchen-toolkit--block').contains('1 hours 10 minutes')
        // cy.get('.foodblogkitchen-toolkit--block').contains('3 bananans')
        // cy.get('.foodblogkitchen-toolkit--block').contains('2 onions')
        // cy.get('.foodblogkitchen-toolkit--block').contains('Slice bananas')
        // cy.get('.foodblogkitchen-toolkit--block').contains('take the onions back')
        // cy.get('.foodblogkitchen-toolkit--block').contains('Additional notes')
        // cy.get('.foodblogkitchen-toolkit--block').contains('Print');

        // Check if the calculator works
        cy.get('.recipe-servings').scrollIntoView().contains('4');
        cy.get('.recipe-increase-servings').click({ force: true });
        cy.get('.recipe-servings').contains('5');
        cy.get('.foodblogkitchen-toolkit--block').contains('2,5 onions');

        // Back to the editor
        cy.go("back");

        cy.get('.foodblogkitchen-toolkit--recipe-block--ingredients + button').click();

        // First group
        const firstGroup = cy.get('.foodblogkitchen-toolkit--recipe-block--flex-container + .foodblogkitchen-toolkit--recipe-block--ingredients');
        firstGroup.find('[aria-label="Group name"]').type('Group 1', { force: true });

        // Second group
        cy.get('.foodblogkitchen-toolkit--recipe-block--flex-container + .foodblogkitchen-toolkit--recipe-block--ingredients + .foodblogkitchen-toolkit--recipe-block--ingredients')
            .find('[aria-label="Group name"]')
            .type('Group 2', { force: true });

        cy.get('.foodblogkitchen-toolkit--recipe-block--flex-container + .foodblogkitchen-toolkit--recipe-block--ingredients + .foodblogkitchen-toolkit--recipe-block--ingredients')
            .find('[aria-label="Add the ingredients here..."]')
            .type('3 Bananas\n4 Garlic', { force: true });

        cy.get('.editor-post-publish-button__button').click();
        cy.get('.components-snackbar__action').click();

        checkRecipeBockScreenshot('recipe-block-with-groups');
    });
});