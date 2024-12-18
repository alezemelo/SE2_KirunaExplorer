/// <reference types="cypress-xpath" />
import 'cypress-xpath';

// test for downloading a file file attached to a document

describe('Download File Test', () => {
    it('Downloads a file attached to a document', () => {


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

        // click on the file attachement button
        cy.xpath('/html/body/div/div/div/div[1]/div/div/div[1]/div/div[1]/div/div/div[2]/button').click();
        cy.wait(2000);

        // click on the download button
        cy.xpath('/html/body/div[2]/div[3]/div/div[1]/ul/li/div[1]/button').click();
        cy.wait(2000);

        // check if the file is downloaded
        cy.contains('loremipsum.txt').should('exist');

    });
});