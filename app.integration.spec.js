const request = require("supertest");

const app = require("./index");
const { check, validationResult } = require("express-validator/check");
const agent = request.agent(app);
const {
	createMessage,
	findUser,
	getMessages,
	seedUsers
} = require("./data-interface");

describe("app", () => {
	describe("when authenticated", () => {
		beforeEach(async () => {
			await agent
				.post("/login")
				.send("username=randombrandon&password=randompassword");
		});
		describe("POST /messages", () => {
			describe("with non-empty content", () => {
				describe("with JavaScript code in personalWebsiteURL", () => {
					it("responds with error", async done => {
						const injectedCode = [];
						const createMessage = {
							username: jest.fn().mockReturnValue("randombrandon"),
							content: jest.fn().mockReturnValue("content"),
							personalWebsiteURL: jest
								.fn()
								.mockReturnValue(`javascript:${injectedCode}`)
						};
						expect(createMessage.personalWebsiteURL()).not.toMatch(
							`javascript:${injectedCode ? injectedCode : ""}`
						);
						done();
					});
				});

				// describe("with HTTP URL in personalWebsiteURL", () => {
				// 	it("responds with success", async done => {
				// 		// …
				// 		done();
				// 	});
				// });
			});
		});
	});
});
