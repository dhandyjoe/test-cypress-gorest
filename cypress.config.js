const { defineConfig } = require("cypress");

module.exports = defineConfig({
	e2e: {
		watchForFileChanges: false,
		experimentalModifyObstructiveThirdPartyCode: true,
		experimentalOriginDependencies: true,

		setupNodeEvents(on, config) {
			// implement node event listeners here
		},
	},
});
