// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('getToken', () => {
	Cypress.session.clearAllSavedSessions()

	Cypress.on(
		'uncaught:exception',
		(err) =>
			!err.message.includes('ResizeObserver loop') &&
			!err.message.includes('Error in protected function')
	)

	cy.visit('https://gorest.co.in/consumer/login')
	cy.get('.btn-outline-success').click()

	cy.origin('https://accounts.google.com', () => {
		Cypress.on('uncaught:exception', (err, runnable) => {
			// returning false here prevents Cypress from failing the test
			return false
		})

		cy.get('input[type="email"]').type('dhandyjoe2@gmail.com', {
			log: false,
		})
		// NOTE: The element exists on the original form but is hidden and gets rerendered, which leads to intermittent detached DOM issues
		cy.contains('Next').click().wait(5000)
		cy.get('[type="password"]').type('201017dj', {
			log: false,
		})
		cy.contains('Next').click().wait(5000)
	})

	cy.get('.user-select-all').then((token) => {
		cy.log(token.text())
		Cypress.env().token = token.text();
	})
})