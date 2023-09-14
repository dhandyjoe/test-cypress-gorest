import { Utils } from "../support/utils";

const utils = new Utils();
let name, email;

describe('Sign in with Google', () => {
	it('Get Token', function () {
		cy.getToken();
	});
})

describe('Create User', () => {
	it("Create user with valid payload", function () {
		name = utils.getRandomName()
		email = utils.getRandomEmail()

		const options = {
			method: "POST",
			url: Cypress.env().baseUrl + '/users',
			headers: {
				Authorization: 'Bearer ' + Cypress.env().token,
			},
			body: {
				name: name,
				email: email,
				gender: "male",
				status: "active"
			},
		};

		cy.request(options).then((response) => {
			expect(response.status).to.eq(201);
			expect(response.body).to.include({
				name: name,
				email: email,
				gender: "male",
				status: "active"
			});

			// Get User ID and store into variable
			Cypress.env().userID = response.body.id;
			cy.log(Cypress.env().userID)
		});
	});

	it("Create user without payload", function () {
		const options = {
			method: "POST",
			url: Cypress.env().baseUrl + '/users',
			headers: {
				Authorization: 'Bearer ' + Cypress.env().token,
			},
			body: {
				name: "",
				email: "",
				gender: "",
				status: ""
			},
			failOnStatusCode: false
		};

		cy.request(options).then((response) => {
			expect(response.status).to.eq(422);
			expect(response.body[0]).to.include({
				field: "email",
				message: "can't be blank",
			});
			expect(response.body[1]).to.include({
				field: "name",
				message: "can't be blank",
			});
			expect(response.body[2]).to.include({
				field: "gender",
				message: "can't be blank, can be male of female",
			});
			expect(response.body[3]).to.include({
				field: "status",
				message: "can't be blank",
			});
		});
	});

	it("Create user has email already exist", function () {
		const options = {
			method: "POST",
			url: Cypress.env().baseUrl + '/users',
			headers: {
				Authorization: 'Bearer ' + Cypress.env().token,
			},
			body: {
				name: "testing",
				email: "meena_kakkar_sen@simonis-mraz.example",
				gender: "male",
				status: "active"
			},
			failOnStatusCode: false
		};

		cy.request(options).then((response) => {
			expect(response.status).to.eq(422);
			expect(response.body[0]).to.include({
				field: "email",
				message: "has already been taken",
			});
		});
	});

	it("Create user with invalid format email", function () {
		const options = {
			method: "POST",
			url: Cypress.env().baseUrl + '/users',
			headers: {
				Authorization: 'Bearer ' + Cypress.env().token,
			},
			body: {
				name: "testing",
				email: "qweqwe",
				gender: "male",
				status: "active"
			},
			failOnStatusCode: false
		};

		cy.request(options).then((response) => {
			expect(response.status).to.eq(422);
			expect(response.body[0]).to.include({
				field: "email",
				message: "is invalid",
			});
		});
	});

	it("Create user with invalid gender (not male / female)", function () {
		const options = {
			method: "POST",
			url: Cypress.env().baseUrl + '/users',
			headers: {
				Authorization: 'Bearer ' + Cypress.env().token,
			},
			body: {
				name: "testing",
				email: "anrvaimvuakvafivnan@gmail.com",
				gender: "qweqwe",
				status: "active"
			},
			failOnStatusCode: false
		};

		cy.request(options).then((response) => {
			expect(response.status).to.eq(422);
			expect(response.body[0]).to.include({
				field: "gender",
				message: "can't be blank, can be male of female",
			});
		});
	});

	it("Create user with invalid status (not active / inactive)", function () {
		const options = {
			method: "POST",
			url: Cypress.env().baseUrl + '/users',
			headers: {
				Authorization: 'Bearer ' + Cypress.env().token,
			},
			body: {
				name: "testing",
				email: "anrvaimvuakvafivnan@gmail.com",
				gender: "male",
				status: "qweqwe"
			},
			failOnStatusCode: false
		};

		cy.request(options).then((response) => {
			expect(response.status).to.eq(422);
			expect(response.body[0]).to.include({
				field: "status",
				message: "can't be blank",
			});
		});
	});

	it("Create user without token", function () {
		const options = {
			method: "POST",
			url: Cypress.env().baseUrl + '/users',
			body: {
				name: "testing",
				email: "anrvaimvuakvafivnan@gmail.com",
				gender: "male",
				status: "qweqwe"
			},
			failOnStatusCode: false
		};

		cy.request(options).then((response) => {
			expect(response.status).to.eq(401);
			expect(response.body).to.include({
				message: "Authentication failed",
			});
		});
	});

	it("Create user with expired token", function () {
		const options = {
			method: "POST",
			url: Cypress.env().baseUrl + '/users',
			headers: {
				Authorization: 'Bearer qweqweqwe',
			},
			body: {
				name: "testing",
				email: "anrvaimvuakvafivnan@gmail.com",
				gender: "male",
				status: "qweqwe"
			},
			failOnStatusCode: false
		};

		cy.request(options).then((response) => {
			expect(response.status).to.eq(401);
			expect(response.body).to.include({
				message: "Invalid token",
			});
		});
	});
})

describe('Get Detail User', () => {
	it("Get Detail", function () {
		const options = {
			method: "GET",
			url: Cypress.env().baseUrl + '/users/' + Cypress.env().userID,
			headers: {
				Authorization: 'Bearer ' + Cypress.env().token,
			},
		};

		cy.request(options).then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body).to.include({
				id: Cypress.env().userID,
				name: name,
				email: email,
				gender: "male",
				status: "active"
			});
		});
	});

	it("Get Detail not found", function () {
		const options = {
			method: "GET",
			url: Cypress.env().baseUrl + '/users/qweqwe',
			headers: {
				Authorization: 'Bearer ' + Cypress.env().token,
			},
			failOnStatusCode: false
		};

		cy.request(options).then((response) => {
			expect(response.status).to.eq(404);
			expect(response.body).to.include({
				message: "Resource not found",
			});
		});
	});

	it("Get Detail without token", function () {
		const options = {
			method: "GET",
			url: Cypress.env().baseUrl + '/users/' + Cypress.env().userID,
			failOnStatusCode: false
		};

		cy.request(options).then((response) => {
			expect(response.status).to.eq(404);
			expect(response.body).to.include({
				message: "Resource not found",
			});
		});
	});

	it("Get Detail with expired token", function () {
		const options = {
			method: "GET",
			url: Cypress.env().baseUrl + '/users/' + Cypress.env().userID,
			headers: {
				Authorization: 'Bearer qweqwe',
			},
			failOnStatusCode: false
		};

		cy.request(options).then((response) => {
			expect(response.status).to.eq(401);
			expect(response.body).to.include({
				message: "Invalid token",
			});
		});
	});
})

describe('Update User', () => {
	it("Update user with valid payload", function () {
		name = utils.getRandomName()
		email = utils.getRandomEmail()

		const options = {
			method: "PUT",
			url: Cypress.env().baseUrl + '/users/' + Cypress.env().userID,
			headers: {
				Authorization: 'Bearer ' + Cypress.env().token,
			},
			body: {
				name: name,
				email: email,
				gender: "female",
				status: "inactive"
			},
		};

		cy.request(options).then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body).to.include({
				name: name,
				email: email,
				gender: "female",
				status: "inactive"
			});
		});
	});

	it("Update user id was deleted", function () {
		const options = {
			method: "PUT",
			url: Cypress.env().baseUrl + '/users/5144116',
			headers: {
				Authorization: 'Bearer ' + Cypress.env().token,
			},
			body: {
				name: "testing",
				email: "akdvmifksvkanvf@gmail.com",
				gender: "female",
				status: "inactive"
			},
			failOnStatusCode: false
		};

		cy.request(options).then((response) => {
			expect(response.status).to.eq(404);
			expect(response.body).to.include({
				message: "Resource not found"
			});
		});
	});

	it("Update user id not found", function () {
		const options = {
			method: "PUT",
			url: Cypress.env().baseUrl + '/users/aevaerva',
			headers: {
				Authorization: 'Bearer ' + Cypress.env().token,
			},
			body: {
				name: "testing",
				email: "akdvmifksvkanvf@gmail.com",
				gender: "female",
				status: "inactive"
			},
			failOnStatusCode: false
		};

		cy.request(options).then((response) => {
			expect(response.status).to.eq(404);
			expect(response.body).to.include({
				message: "Resource not found"
			});
		});
	});

	it("Update user without payload", function () {
		const options = {
			method: "PUT",
			url: Cypress.env().baseUrl + '/users/' + Cypress.env().userID,
			headers: {
				Authorization: 'Bearer ' + Cypress.env().token,
			},
			body: {
				name: "",
				email: "",
				gender: "",
				status: ""
			},
			failOnStatusCode: false
		};

		cy.request(options).then((response) => {
			expect(response.status).to.eq(422);
			expect(response.body[0]).to.include({
				field: "email",
				message: "can't be blank",
			});
			expect(response.body[1]).to.include({
				field: "name",
				message: "can't be blank",
			});
			expect(response.body[2]).to.include({
				field: "gender",
				message: "can't be blank, can be male of female",
			});
			expect(response.body[3]).to.include({
				field: "status",
				message: "can't be blank",
			});
		});
	});

	it("Update user has email already exist", function () {
		const options = {
			method: "PUT",
			url: Cypress.env().baseUrl + '/users/' + Cypress.env().userID,
			headers: {
				Authorization: 'Bearer ' + Cypress.env().token,
			},
			body: {
				name: "testing",
				email: "meena_kakkar_sen@simonis-mraz.example",
				gender: "male",
				status: "active"
			},
			failOnStatusCode: false
		};

		cy.request(options).then((response) => {
			expect(response.status).to.eq(422);
			expect(response.body[0]).to.include({
				field: "email",
				message: "has already been taken",
			});
		});
	});


	it("Update user with invalid format email", function () {
		const options = {
			method: "PUT",
			url: Cypress.env().baseUrl + '/users/' + Cypress.env().userID,
			headers: {
				Authorization: 'Bearer ' + Cypress.env().token,
			},
			body: {
				name: "testing",
				email: "qweqwe",
				gender: "male",
				status: "active"
			},
			failOnStatusCode: false
		};

		cy.request(options).then((response) => {
			expect(response.status).to.eq(422);
			expect(response.body[0]).to.include({
				field: "email",
				message: "is invalid",
			});
		});
	});

	it("Update user with invalid gender (not male / female)", function () {
		const options = {
			method: "PUT",
			url: Cypress.env().baseUrl + '/users/' + Cypress.env().userID,
			headers: {
				Authorization: 'Bearer ' + Cypress.env().token,
			},
			body: {
				name: "testing",
				email: "anrvaimvuakvafivnan@gmail.com",
				gender: "qweqwe",
				status: "active"
			},
			failOnStatusCode: false
		};

		cy.request(options).then((response) => {
			expect(response.status).to.eq(422);
			expect(response.body[0]).to.include({
				field: "gender",
				message: "can't be blank, can be male of female",
			});
		});
	});

	it("Update user with invalid status (not active / inactive)", function () {
		const options = {
			method: "PUT",
			url: Cypress.env().baseUrl + '/users/' + Cypress.env().userID,
			headers: {
				Authorization: 'Bearer ' + Cypress.env().token,
			},
			body: {
				name: "testing",
				email: "anrvaimvuakvafivnan@gmail.com",
				gender: "male",
				status: "qweqwe"
			},
			failOnStatusCode: false
		};

		cy.request(options).then((response) => {
			expect(response.status).to.eq(422);
			expect(response.body[0]).to.include({
				field: "status",
				message: "can't be blank",
			});
		});
	});

	it("Update user without token", function () {
		const options = {
			method: "PUT",
			url: Cypress.env().baseUrl + '/users/' + Cypress.env().userID,
			body: {
				name: "testing",
				email: "anrvaimvuakvafivnan@gmail.com",
				gender: "male",
				status: "qweqwe"
			},
			failOnStatusCode: false
		};

		cy.request(options).then((response) => {
			expect(response.status).to.eq(404);
			expect(response.body).to.include({
				message: "Resource not found",
			});
		});
	});

	it("Update user with expired token", function () {
		const options = {
			method: "PUT",
			url: Cypress.env().baseUrl + '/users/' + Cypress.env().userID,
			headers: {
				Authorization: 'Bearer qweqweqwe',
			},
			body: {
				name: "testing",
				email: "anrvaimvuakvafivnan@gmail.com",
				gender: "male",
				status: "qweqwe"
			},
			failOnStatusCode: false
		};

		cy.request(options).then((response) => {
			expect(response.status).to.eq(401);
			expect(response.body).to.include({
				message: "Invalid token",
			});
		});
	});
})

describe('Delete User', () => {
	it("Delete User", function () {
		const options = {
			method: "DELETE",
			url: Cypress.env().baseUrl + '/users/' + Cypress.env().userID,
			headers: {
				Authorization: 'Bearer ' + Cypress.env().token,
			},
		};

		cy.request(options).then((response) => {
			expect(response.status).to.eq(204);
		});
	});

	it("Get Detail was deleted", function () {
		const options = {
			method: "GET",
			url: Cypress.env().baseUrl + '/users/' + Cypress.env().userID,
			headers: {
				Authorization: 'Bearer ' + Cypress.env().token,
			},
			failOnStatusCode: false
		};

		cy.request(options).then((response) => {
			expect(response.status).to.eq(404);
			expect(response.body).to.include({
				message: "Resource not found",
			});
		});
	});

	it("Delete User ID was deleted", function () {
		const options = {
			method: "DELETE",
			url: Cypress.env().baseUrl + '/users/5144116',
			headers: {
				Authorization: 'Bearer ' + Cypress.env().token,
			},
			failOnStatusCode: false
		};

		cy.request(options).then((response) => {
			expect(response.status).to.eq(404);
			expect(response.body).to.include({
				message: "Resource not found",
			});
		});
	});

	it("Delete User ID not found", function () {
		const options = {
			method: "DELETE",
			url: Cypress.env().baseUrl + '/users/qweqwe',
			headers: {
				Authorization: 'Bearer ' + Cypress.env().token,
			},
			failOnStatusCode: false
		};

		cy.request(options).then((response) => {
			expect(response.status).to.eq(404);
			expect(response.body).to.include({
				message: "Resource not found",
			});
		});
	});

	it("Delete User without token", function () {
		const options = {
			method: "DELETE",
			url: Cypress.env().baseUrl + '/users/' + Cypress.env().userID,
			failOnStatusCode: false
		};

		cy.request(options).then((response) => {
			expect(response.body).to.include({
				message: "Resource not found",
			});
		});
	});

	it("Delete User with expired token", function () {
		const options = {
			method: "GET",
			url: Cypress.env().baseUrl + '/users/' + Cypress.env().userID,
			headers: {
				Authorization: 'Bearer qweqwe',
			},
			failOnStatusCode: false
		};

		cy.request(options).then((response) => {
			expect(response.body).to.include({
				message: "Invalid token",
			});
		});
	});
})