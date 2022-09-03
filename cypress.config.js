const { defineConfig } = require("cypress");

module.exports = defineConfig({
  wp: {
    version: ["6.0.2"],
    plugins: ["./"],
    locale: "de_DE",
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
