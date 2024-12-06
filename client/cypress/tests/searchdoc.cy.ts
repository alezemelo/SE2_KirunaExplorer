// write test for search document as like as the others test and serach for the objects with full xpath
// search for the document  as an anonymous user
require('cypress-xpath');

describe('Search Document Test', () => {
    it('Searches for a document in the application', () => {

        // visit the home page
        cy.visit('/');
        cy.wait(3000);

        // no need to login for this test

        // search for the document
        cy.xpath('/html/body/div/div/header/div/div[2]/div/div/input').type('deformation');

        cy.wait(2000);

        // click on the search button
        cy.xpath('/html/body/div/div/header/div/div[2]/div/button').click();
        cy.wait(2000);
        // check if the document is found
        cy.contains('Deformation forecast (45)').should('exist');

        cy.wait(2000);

    }
)});
