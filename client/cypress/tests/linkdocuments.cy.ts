/// <reference types="cypress-xpath" />
import 'cypress-xpath';

// This test is for the link documents feature

describe('Link Documents Test', () => {
    it('Links a document to another document', () => {
        // Visit the login page

        cy.visit('/');
        cy.wait(1000);
        cy.visit('/login');
  
        // Log in
        cy.get('input[type="username"]').type('admin');
        cy.get('input[type="password"]').type('pass3');
        cy.get('button[type="submit"]').click();
        cy.wait(2000);
  
        // find out the buuton to add document and click on it
        cy.get('button[class="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-colorPrimary MuiButton-fullWidth MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-colorPrimary MuiButton-fullWidth css-qxc2i0-MuiButtonBase-root-MuiButton-root"]').
        click();

  
        
        cy.get('input[name="title"]').type('Test Document');
        cy.wait(1000);
        
        cy.xpath('/html/body/div[2]/div[3]/div/div[1]/div[2]/div/div/div').click(); 
        cy.xpath('//li[contains(text(), "LKAB")]').click(); 
        cy.wait(1000);
      

        cy.get('body').type('{esc}');



        
        
        // choose the doctype from the dropdown menu

        cy.xpath('/html/body/div[2]/div[3]/div/div[1]/div[4]/div[1]/div/div').click(); 
        cy.xpath('//li[contains(text(), "design_doc")]').click(); 
        cy.wait(1000);

        // choose the sclae from the dropdown menu

        cy.xpath('/html/body/div[2]/div[3]/div/div[1]/div[5]/div[1]/div/div').click();
        cy.xpath('//li[contains(text(), "1:1000")]').click();
        cy.wait(1000);

        // select radio button just year

        cy.xpath('/html/body/div[2]/div[3]/div/div[1]/div[6]/div/label[1]/input').check();
        cy.wait(1000);

        //input the date as an example

        cy.xpath('/html/body/div[2]/div[3]/div/div[1]/div[7]/div/input').type('2022');
        cy.wait(1000);
        
        // write content in description field
        
        cy.get('textarea[name="description"]').type('This is a test document.');
        cy.wait(1000);

  
        // Submit the form

        cy.xpath('/html/body/div[2]/div[3]/div/div[2]/button[2]').click();
        cy.wait(1000);
        
  
        // Check that the document was added

        cy.contains('Test Document');

        // click on the document which was added

        cy.contains('Test Document').click();

        // click on the link document button

        cy.xpath('/html/body/div/div/div/div[1]/div/div/div[1]/div/div[1]/div/div/div[4]/button[2]').click();
        cy.wait(1000);
        // search for the document to link
        cy.xpath('/html/body/div[2]/div[3]/div/div[1]/div/div/input').type('Adjusted');
        cy.wait(1000);

        //click on the search button
        cy.xpath('/html/body/div[2]/div[3]/div/div[1]/div/button').click();
        cy.wait(1000);
        
        // click on the document to link

        cy.xpath('/html/body/div[2]/div[3]/div/div[1]/ul/div').click();
        cy.wait(1000);
        
        // click on the link button

        cy.xpath('/html/body/div[2]/div[3]/div/div[2]/button[1]').click({multiple: true});
        cy.wait(1000);

        // check if the document was linked

    });
});