const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: '67hu8w',
  env: {
    apiUrl: 'http://localhost:8080',
  },
  e2e: {
    specPattern: 'test/e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {},
    supportFile: false,
  },
})