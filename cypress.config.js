const { defineConfig } = require("cypress");

module.exports = defineConfig({
	reporter: 'cypress-mochawesome-reporter',
	reporterOptions: {
		charts: true,
		reportPageTitle: 'custom-title',
		embeddedScreenshots: true,
		inlineAssets: true,
		saveAllAttempts: false,
	},
	e2e: {
		watchForFileChanges: false,
		experimentalModifyObstructiveThirdPartyCode: true,
		experimentalOriginDependencies: true,

		setupNodeEvents(on, config) {
			// implement node event listeners here
			require('cypress-mochawesome-reporter/plugin')(on);
		},
	},
});
