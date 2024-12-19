// i want to click on the document and click on a button which will open the diagram

/// <reference types="cypress-xpath" />
import 'cypress-xpath';

describe('Map Document to Diagram Test', () => {
    beforeEach(() => {
        // Ignore uncaught exceptions
        cy.on('uncaught:exception', (err, runnable) => {
          // returning false here prevents Cypress from failing the test
          return false;
        });
      });
    it('Map a document to a diagram', () => {

        // visit the home page
        cy.visit('/');
        cy.wait(3000);

        // visit the map page
        cy.visit('/map');
        cy.wait(3000);

        // Visit the login page
        cy.visit('/login');
    
        
        cy.get('input[type="username"]').type('admin');
        cy.get('input[type="password"]').type('pass3');
    
        // Submit the form
        cy.get('button[type="submit"]').click();

        // findout the button logout and click on it
        //get time to wit for the page to load
        cy.wait(5000);


        // click on the document
        cy.xpath('/html/body/div/div/div/div[1]/div/div/div[1]/div/div[5]/div/div').click();
        cy.wait(2000);

        // click on the button form the list
        cy.xpath('/html/body/div/div/div/div[1]/div/div/div[1]/div/div[5]/div/div/div[5]/button').click();
        cy.wait(2000);

        // find element with highlighted class and click on it
        cy.get('.highlighted-circle').click();
        // check if the document is found
        cy.contains('The development plan shapes the form of the new city. The document, unlike previous competition documents, is written entirely in Swedish, which reflects the target audience: the citizens of Kiruna. The plan obviously contains many elements of the winning masterplan from the competition, some recommended by the jury, and others that were deemed appropriate to integrate later. The document is divided into four parts, with the third part, spanning 80 pages, describing the shape the new city will take and the strategies to be implemented for its relocation through plans, sections, images, diagrams, and texts. The document also includes numerous studies aimed at demonstrating the future success of the project').should('exist');


    });
});