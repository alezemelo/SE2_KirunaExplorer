/// <reference types="cypress-xpath" />
import 'cypress-xpath';
// search for the link documents
describe('Search for link documents', () => {
    it('Searches for a document link in the application', () => {

        cy.visit('/login');
        // Log in
        cy.get('input[type="username"]').type('admin');
        cy.get('input[type="password"]').type('pass3');
        cy.get('button[type="submit"]').click();
        cy.wait(5000);

        // add a test document

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
        cy.xpath('//li[contains(text(), "design_doc")]').click(); 
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

        //click on the document that was added
        cy.xpath('/html/body/div/div/div/div[1]/div/div/div[1]/div/div[1]/div/div').click();

        // search for the document link button and click on it

        cy.xpath('/html/body/div/div/div/div[1]/div/div/div[1]/div/div[1]/div/div/div[4]/button[2]').click();
        cy.wait(2000);

        // search for the document link and click on it

        cy.xpath('/html/body/div[2]/div[3]/div/div[1]/div/div/input').type('Test Document');

        cy.wait(2000);

        // click on the search button

        cy.xpath('/html/body/div[2]/div[3]/div/div[1]/div/button').click();
        cy.wait(2000);

        // check if the document is found

        cy.contains('Test Document');
    }
    )
}
)
