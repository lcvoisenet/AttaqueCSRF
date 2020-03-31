const request = require("supertest");

const dataInterface = require("../data-interface");
const app = require("../app");
const agent = request.agent(app);

describe("app", () => {
	describe("when authenticated", () => {
		beforeEach(async () => {
			dataInterface.createMessage = jest.fn();
			await agent
				.post("/login")
				.send("username=randombrandon&password=randompassword");
		});
		describe("POST /messages", () => {
			describe("with non-empty content", () => {
				describe("with JavaScript code in personalWebsiteURL", () => {
					it("responds with error", async done => {
						const res = await agent
							.post("/messages")
							.send(
								"content=hello&personalWebsiteURL=javascript:alert('Hacked')"
							);
						expect(res.status).toEqual(400);
						expect(dataInterface.createMessage).toHaveBeenCalledTimes(0);
						// const injectedCode = [];
						// const createMessage = {
						// 	username: jest.fn().mockReturnValue("randombrandon"),
						// 	content: jest.fn().mockReturnValue("content"),
						// 	personalWebsiteURL: jest.fn().mockReturnValue(`bruh`)
						// };
						// expect(createMessage.personalWebsiteURL()).not.toMatch(
						// 	`javascript:${injectedCode ? injectedCode : ""}`
						// );
						done();
					});
				});
				describe("with HTTP URL in personalWebsiteURL", () => {
					it("responds with success", async done => {
						const res = await agent
							.post("/messages")
							.send("content=hello&personalWebsiteURL=https://google.com");
						expect(res.status).toEqual(201);
						expect(dataInterface.createMessage).toHaveBeenCalledTimes(1);
						expect(dataInterface.createMessage).toHaveBeenCalledWith(
							"randombrandon",
							"hello",
							"https://google.com"
						);
						done();
					});
				});
			});
		});
	});
});
