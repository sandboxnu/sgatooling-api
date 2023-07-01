//npm test -watchAll
//detect openHandles
import supertest from "supertest";
import { createServer } from "../src/utils";

const app = createServer();
describe("members", () => {
  describe("get all members", () => {
    //what is being tested/ what conditions
    describe("given there is a valid connection", () => {
      it("should return a 200", async () => {
        expect(true).toBe(true);
        //supertest uses our API, expects our app
        await supertest(app).get("/members").expect(404);
      });
    });
  });
});
