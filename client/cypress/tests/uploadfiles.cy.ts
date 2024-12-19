/// <reference types="cypress-xpath" />
import 'cypress-xpath';
import 'cypress-file-upload';

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      attachFile(fileName: string): Chainable<Subject>;
    }
  }
}

// This test is for the upload files feature    
describe('Upload Files Test', () => {
    beforeEach(() => {
        // Ignore uncaught exceptions
        cy.on('uncaught:exception', (err, runnable) => {
          // returning false here prevents Cypress from failing the test
          return false;
        });
      });
    it('Uploads a file to the specific doc', () => {
        cy.visit('/');

        // Log in

        cy.visit('/login');
        cy.get('input[type="username"]').type('admin');
        cy.get('input[type="password"]').type('pass3');
    
        // Submit the form
        cy.get('button[type="submit"]').click();

        // findout the button logout and click on it
        //get time to wit for the page to load
        cy.wait(5000);

        // click on the document
        cy.xpath('/html/body/div/div/div/div[1]/div/div/div[1]/div/div[1]/div/div').click();
        cy.wait(2000);

        // click on the upload button
        cy.xpath('/html/body/div/div/div/div[1]/div/div/div[1]/div/div[1]/div/div/div[3]/label/span').click();
        cy.wait(2000);

        // upload the file
        cy.get('input[type="file"]').attachFile('loremipsum.txt');

        // click on the upload button
        // cy.xpath('/html/body/div/div/div/div[1]/div/div/div[1]/div/div[1]/div/div/div[3]/label/span').click();
        cy.wait(2000);

        // check if the file is uploaded
        cy.contains('loremipsum.txt').should('exist');

    }
);
});

