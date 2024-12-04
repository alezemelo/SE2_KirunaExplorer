describe('Add Document Test', () => {
    it('Adds a document to the application', () => {
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

  
        // Fill out the form
        cy.get('input[name="title"]').type('Test Document');
        // choose stakeholder form the dropdown menu by label
        cy.get('select[name="Stakeholders"]').select('LKAB');
        // cy.get('select[name="stakeholders"]').select('LKAB');
        // cy.get('select[value="newStakeholder"]').select('LKAB');
        // choose the doctype from the dropdown menu
        cy.get('select[id=":r11:"]').select('design_doc');
        // choose the sclae from the dropdown menu
        cy.get('select[id=":r12:"]').select('1:1000');
        // select radio button just year
        cy.get('input[id=":r13:"]').check();
        //input the date as an example
        cy.get('input[name="date"]').type('2022');
        // select the langiuae from the dropdown menu
        cy.get('select[id=":r15:"]').select('Swedish');
        // checkbox all municipalities
        cy.get('input[id=":r16:"]').check();
        // cy.get('textarea[name="content"]').type('This is a test document.');
        // cy.get('input[name="location"]').type('Kiruna');
        // write content in description field
        cy.get('textarea[name="description"]').type('This is a test document.');
  
        // Submit the form
        cy.get('button[type="save"]').click();
  
        // Check that the document was added
        cy.contains('Test Document');
    });
  }
);