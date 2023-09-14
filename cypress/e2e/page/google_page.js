export class GithubPage {
	enterUsername(username) {
		cy.get('[name="identifier"]').type(username)
	}

	enterPassword(password) {
		cy.get('[type="password"]').type(password)
	}
}