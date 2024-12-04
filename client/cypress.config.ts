const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here if needed
    },
    baseUrl: 'http://localhost:5173', // Update with your app's base URL
    specPattern: 'E2E_test/tests/**/*.cy.{js,ts}', // Pattern for spec files
    supportFile: false, // Disable support file if unused
  },
});
