/// <reference types="cypress-xpath" />
import 'cypress-xpath';
describe('Login Test', () => {
    it('Logs into the application', () => {
      // Visit the login page
      cy.visit('/login');
  
      
      cy.get('input[type="username"]').type('admin');
      cy.get('input[type="password"]').type('pass3');
  
      // Submit the form
      cy.get('button[type="submit"]').click();

      // findout the button logout and click on it
      //get time to wait for the page to load
      cy.wait(5000);
      cy.get('button[class="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedError MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-colorError MuiButton-root MuiButton-contained MuiButton-containedError MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-colorError css-1ryny94-MuiButtonBase-root-MuiButton-root"]').click();


  

    });
  });
  