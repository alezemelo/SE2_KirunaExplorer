// Full version of the E2E test with the whole function of my app
// Test the whole app from the beginning to the end

// Import the necessary modules
/// <reference types="cypress-xpath" />
import 'cypress-xpath';

// Describe the test
describe('E2E Test', () => {
    beforeEach(() => {
        // Ignore uncaught exceptions
        cy.on('uncaught:exception', (err, runnable) => {
          // returning false here prevents Cypress from failing the test
          return false;
        });
      });
    it('Test the login page', () => {
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

    it('Test the add document page', () => {
        // Visit the login page
        cy.visit('/login');
  
        // Log in
        cy.get('input[type="username"]').type('admin');
        cy.get('input[type="password"]').type('pass3');
        cy.get('button[type="submit"]').click();
        cy.wait(5000);
  
        // find out the buuton to add document and click on it
        cy.get('button[class="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-colorPrimary MuiButton-fullWidth MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-colorPrimary MuiButton-fullWidth css-qxc2i0-MuiButtonBase-root-MuiButton-root"]').
        click();

  
        
        cy.get('input[name="title"]').type('Test Document');
        cy.wait(2000);
        
        cy.xpath('/html/body/div[2]/div[3]/div/div[1]/div[2]/div/div/div').click(); 
        cy.xpath('//li[contains(text(), "LKAB")]').click(); 
        cy.wait(2000);
      

        cy.get('body').type('{esc}');



        
        
        // choose the doctype from the dropdown menu

        cy.xpath('/html/body/div[2]/div[3]/div/div[1]/div[4]/div[1]/div/div').click(); 
        cy.xpath('/html/body/div[3]/div[3]/ul/li[3]').click(); 
        cy.wait(2000);

        // choose the sclae from the dropdown menu

        cy.xpath('/html/body/div[2]/div[3]/div/div[1]/div[5]/div[1]/div/div').click();
        cy.xpath('//li[contains(text(), "1:1000")]').click();
        cy.wait(2000);

        // select radio button just year

        cy.xpath('/html/body/div[2]/div[3]/div/div[1]/div[6]/div/label[1]/input').check();
        cy.wait(2000);

        //input the date as an example

        cy.xpath('/html/body/div[2]/div[3]/div/div[1]/div[7]/div/input').type('2022');
        cy.wait(2000);
        
        // write content in description field
        
        cy.get('textarea[name="description"]').type('This is a test document.');
        cy.wait(2000);

  
        // Submit the form

        cy.xpath('/html/body/div[2]/div[3]/div/div[2]/button[2]').click();
        cy.wait(2000);
        
  
        // Check that the document was added

        cy.contains('Test Document');
    });
    // edit dcoument description
    it('Test the edit document description', () => {

        // Visit the login page
        cy.visit('/login');
  
        // Log in
        cy.get('input[type="username"]').type('admin');
        cy.get('input[type="password"]').type('pass3');
        cy.get('button[type="submit"]').click();
        cy.wait(5000);
        
        // edit the document description as like as the add document test

        // first click on the document
        cy.xpath('/html/body/div/div/div/div[1]/div/div/div[1]/div/div[1]/div/div').click();
        cy.wait(2000);
        // click on the edit button
        cy.xpath('/html/body/div/div/div/div[1]/div/div/div[1]/div/div[1]/div/div/div[4]/button[1]').click();
        cy.wait(2000);
        // edit the description
        cy.get('textarea[name="description"]').clear();
        cy.get('textarea[name="description"]').type('This is an edited test document.');
        cy.wait(2000);
        // click on the save button
        cy.xpath('/html/body/div[2]/div[3]/div/div[2]/button[2]').click();
        cy.wait(2000);
        cy.wait(2000);
        // show the document
        cy.xpath('/html/body/div/div/div/div[1]/div/div/div[1]/div/div[1]/div/div').click();
        cy.contains('This is an edited test document.');
    }
);
    // links document
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
        cy.xpath('/html/body/div[3]/div[3]/ul/li[3]').click(); 
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

    // test show the document from map to diagram

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
        
    // 

    });

    // test for upload files


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

// test for downloading a file file attached to a document
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

    





