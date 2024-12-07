/// <reference types="cypress-xpath" />
import 'cypress-xpath';
describe('Edit Document Description Test', () => {
    it('Edits the description of a document in the application', () => {
        // Visit the login page
        cy.visit('/login');
  
        // Log in
        cy.get('input[type="username"]').type('admin');
        cy.get('input[type="password"]').type('pass3');
        cy.get('button[type="submit"]').click();
        cy.wait(5000);
        
        // edit the document description as like as the add document test

        // first click on the document
        cy.xpath('/html/body/div/div/div/div[1]/div/div[1]/div/div[1]/div/div').click();
        cy.wait(2000);
        // click on the edit button
        cy.xpath('/html/body/div/div/div/div[1]/div/div[1]/div/div[1]/div/div/div[4]/button[1]').click();
        cy.wait(2000);
        // edit the description
        cy.get('textarea[name="description"]').clear();
        cy.get('textarea[name="description"]').type('This is an edited test document.');
        cy.wait(2000);
        // click on the save button
        cy.xpath('/html/body/div[2]/div[3]/div/div[2]/button[2]').click();
        cy.wait(2000);
        cy.wait(2000);
        // show the

    }
);
});