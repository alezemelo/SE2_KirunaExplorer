#### Use this document to add things that everybody should take into account when developing their code. If you have misgivings or doubts contact the author of the comment.  


# Dates  
(Dragos)  
Every time a field requires the date type use the `dayjs` date type instead of javascript's `Date`.  
IMPORTANT: when generating a dayjs date use dayjs.utc() in order to avoid timezone bugs.  
The document dates may only have the year, but for the time being, I am handling them as year-1st-jan, so display that. Later on I'll make our own personalized DocumentDate class able to return the correct string format (i.e. only year, only year+month, or full date)

# Db implementation
(Angelo)  
For doubts about the db structure see the file `database_structure.md` or equivalently refer to the article in the Knowledge base tab on youtrack.

# How to run the db container
(Angelo)  
Make sure you have docker installed
Navigate to the project folder and run
`docker build -t kiruna-postgis-img .`
to build an image, then to run a container from that image, run:
`docker run -d --name kiruna-postgis-container -p 5432:5432 kiruna-postgis-img`

# how to run the backend frontend and database as three connected containers
(Angelo)
If it is running, stop the db container from Docker desktop, as it occupies the localhost:5432 socket
In the root dir of the project, run docker-compose up --build (docker compose is not functioning in macOS out of the box, instructions to fix are here `https://docs.docker.com/compose/install/`).
This creates the required images in your docker, and automatically runs them.
You should see a new container in docker desktop, click on it to see that it is split in the individual containers for server, client and db.
Lastly remember to run the latest migration of the database: since the container for the db is something separate from our usual db container, it's not initialized and needs a migration to get all the tables.
The three parts of the application running in containers should not be used to develop, they will probably just be used to deliver a functioning product to product owners.
We can continue developing by running client and server in local, and the db inside the old container, like we did until now.

# I want to modify the db structure
(Angelo)  
If you want to add / delete a table, or make changes to fields of a table, navigate with your command line to `server/src/db`,
then create a new migration file with
`npx knex migrate:make your_modification_name --knexfile knexfile.ts`
go to `server/src/db/migrations` and edit the migration file you just created, you can find examples on how to do it searching "knex migration" online.
When you're done, go back to `server/src/db` and run:
`npx knex migrate:latest --knexfile knexfile.ts`
if you want to roll back run:
`npx knex migrate:rollback --knexfile knexfile.ts`
New migration files should always be committed and pushed to github.
Remember to run `migrate:latest` alter a pull to get the latest version of the db, in case someone changes something. Also if you make changes to the schema please tell other people.  

(Dragos)  
If you want to _alter_ a table, use knex.schema.raw() instead of knex.schema.alterTable(), as the latter doesn't alter correctly for some reason.

# Errors
(Dragos)  
Refer to the standard error codes specified at the top of API.md.  
If you feel like it's needed create an Error Object (for db errors like Foreign Constraint Error or Unique Key Error for example there's already specific objects).  

# DB
(Dragos)  
When inserting on a table that uses autoincrement you should not provide the primary key if not necessary. In case you absolutely need to provide it, run this `await db.raw("SELECT setval(pg_get_serial_sequence('documents', 'id'), (SELECT MAX(id) FROM documents) + 1)");` after, in order to update the autincrement's status.  
(Dragos)
Foreign keys may get disabled for some reason. To check you can run test_integration/db_constraints.test.ts. To fix you can just run temp_db_init() or any other file that contains some activation of foreign keys.  


# End2End Testing


# Using Cypress for End-to-End Testing

This guide explains how to set up and run Cypress for end-to-end testing in your project.

---

## Prerequisites
1. Install Cypress using npm:
   ```bash
   npm install cypress --save-dev
   ```
2. Ensure your application server is running (`npm start` or equivalent).

---

## Setup
1. **Cypress Directory**: Test files are located in the `cypress/E2E_test/tests` directory.
2. **Configuration**: Cypress configuration file (`cypress.config.ts`) is set up to match your project structure.

---

## Running Tests
1. Open Cypress Test Runner:
   ```bash
   npx cypress open
   ```
2. Select the browser and run the desired test file from the Cypress GUI.

Alternatively, run all tests in headless mode:
   ```bash
   npx cypress run
   ```

---

## Writing Tests
1. Create a new test file in `cypress/e2e/` (e.g., `NewTest.cy.ts`).
2. Example Test:
   ```typescript
   describe('Example Test', () => {
     it('should visit the home page', () => {
       cy.visit('/');
       cy.contains('Welcome').should('be.visible');
     });
   });
   ```

---


*** Currently the functionality of adding a doc , editing a doc ,login and logout has been tested ***

