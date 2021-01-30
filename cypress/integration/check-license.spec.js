describe('Check if license is required', () => {
    it('should not be possible to enter a recipe without license', () => {
        cy.visit('http://localhost/wp-admin/post-new.php');
        cy.get('.wp-block > .components-dropdown > .components-button').click();
        cy.get('#block-editor-inserter__search-0').click();
        cy.get('#block-editor-inserter__search-0').type('Recipe');
        cy.get('.editor-block-list-item-foodblogkitchen-recipes-block').click();
        cy.contains('You have not activated the license yet');
    })

    it('should be possible to activate/deactivate a valid license', () => {
        cy.visit('http://localhost/wp-admin/admin.php?page=foodblogkitchen_toolkit_license');
        cy.get('#foodblogkitchen_toolkit__license_key').should('have.value', '');
        cy.get('#foodblogkitchen_toolkit__license_key').type('5ff5cd22687bc');
        cy.get('[value="Activate"]').click();
        cy.contains('Your license has been successfully activated.');
        cy.get('[value="Deactivate"]').click();
        cy.contains('The license has been successfully deactivated.');
    });
});
