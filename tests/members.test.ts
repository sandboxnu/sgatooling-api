// interestingly this can actually connect to my db and return proper values, for now just using mocks
// but in the future if we want to test actual functionality and logic with routes?
import supertest from "supertest";
import { createServer } from "../src/utils";
import MembersController from "../src/controllers/memberController";

const app = createServer();

const mockMember = {
  id: "some-uuid-stri-ngv4",
  nuid: 123456789,
  first_name: "mock",
  last_name: "member",
  email: "email@adress.com",
  active_member: true,
  can_vote: true,
  receive_email_notifs: true,
  include_in_quorum: true,
  can_log_in: true,
};

describe("Member Route tests", () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  describe("Get Members Route", () => {
    it("should return a 200 status, and the items from the getAllMembers Controller", async () => {
      const mockMembersController = jest
        .spyOn(MembersController.prototype, "getAllMembers")
        //@ts-ignore
        .mockReturnValueOnce(mockMember);

      const { statusCode, body } = await supertest(app).get("/members");
      expect(statusCode).toBe(200);

      expect(body).toEqual(mockMember);

      expect(mockMembersController).toHaveBeenCalledTimes(1);
    });

    it("should return all members, when there is an array of members", async () => {
      const multipleMembers = [mockMember, mockMember];
      const mockMembersController = jest
        .spyOn(MembersController.prototype, "getAllMembers")
        //@ts-ignore
        .mockReturnValueOnce(multipleMembers);

      const { statusCode, body } = await supertest(app).get("/members");
      expect(statusCode).toBe(200);

      expect(body).toEqual(multipleMembers);
      expect(mockMembersController).toHaveBeenCalledTimes(1);
    });

    it("should return 200 when passing in a correct Query Parameter", async () => {
      const mockMembersControllerAllMembers = jest
        .spyOn(MembersController.prototype, "getAllMembers")
        //@ts-ignore
        .mockReturnValueOnce(mockMember);

      const mockMembersControllerGroupMembers = jest
        .spyOn(MembersController.prototype, "getSpecificGroup")
        //@ts-ignore
        .mockReturnValueOnce(mockMember);

      const { statusCode } = await supertest(app)
        .get("/members")
        .query({ group: "Sandbox" });

      expect(statusCode).toBe(200);

      //should go to correct query parameter function
      expect(mockMembersControllerGroupMembers).toHaveBeenCalledTimes(1);
      expect(mockMembersControllerAllMembers).toHaveBeenCalledTimes(0);
    });

    it("should return a 400 status code and an error, when passing in invalid query Params", async () => {
      const mockMembersControllerGroupMembers = jest
        .spyOn(MembersController.prototype, "getSpecificGroup")
        //@ts-ignore
        .mockReturnValueOnce(mockMember);

      const { statusCode } = await supertest(app)
        .get("/members")
        .query({ notAValidParam: "Sandbox" });

      expect(statusCode).toBe(405);

      //Controller should not be called with the invalid params:
      expect(mockMembersControllerGroupMembers).toHaveBeenCalledTimes(0);
    });

    it("should return a 404 error when there are no members", async () => {
      const mockMembersController = jest
        .spyOn(MembersController.prototype, "getAllMembers")
        //@ts-ignore
        .mockReturnValueOnce(null);

      const { statusCode } = await supertest(app).get("/members");

      expect(statusCode).toBe(404);
    });

    it("should return a 500 when the promise/database fails", async () => {
      const mockMembersController = jest
        .spyOn(MembersController.prototype, "getAllMembers")
        //@ts-ignore
        .mockRejectedValueOnce("Rejecting");

      const { statusCode } = await supertest(app).get("/members");

      expect(statusCode).toBe(500);
    });
  });

  describe("Post Route", () => {
    const mockMembersControllerCreateMember = jest
      .spyOn(MembersController.prototype, "createMember")
      // @ts-ignore
      .mockReturnValue(mockMember);

    it("should throw an error when we are missing required elements", async () => {
      const invalidJson = {
        nuid: 123456789,
        first_name: "another",
        last_name: "mockMember",
        email: "something",
        active_member: false,
        can_vote: false,
        include_in_quorum: false,
      };

      const { statusCode } = await supertest(app)
        .post("/members")
        .send(invalidJson);
      expect(statusCode).toBe(404);

      expect(mockMembersControllerCreateMember).not.toHaveBeenCalled();
    });

    it("should throw an error when we pass in incorrect types for the elements", async () => {
      const invalidJson = {
        nuid: 123456789,
        first_name: "another",
        last_name: "mockMember",
        email: "something",
        active_member: false,
        receive_email_notifs: true,
        include_in_quorum: "string",
        can_log_in: "string",
      };

      const { statusCode } = await supertest(app)
        .post("/members")
        .send(invalidJson);
      expect(statusCode).toBe(404);

      expect(mockMembersControllerCreateMember).not.toHaveBeenCalled();
    });

    it("should throw an error when we have additional props", async () => {
      const invalidJson = {
        nuid: 123456789,
        first_name: "another",
        last_name: "mockMember",
        email: "something",
        active_member: false,
        receive_email_notifs: true,
        include_in_quorum: true,
        can_log_in: true,
        unecessaryEntry: "something",
      };

      const { statusCode } = await supertest(app)
        .post("/members")
        .send(invalidJson);

      expect(statusCode).toBe(404);

      expect(mockMembersControllerCreateMember).not.toHaveBeenCalled();
    });

    it("should correctly return the expected created member", async () => {
      const newMember = {
        nuid: 123456789,
        first_name: "another",
        last_name: "mockMember",
        email: "something",
        active_member: true,
        can_vote: true,
        include_in_quorum: true,
        receive_email_notifs: true,
        can_log_in: true,
      };

      const mockMembersControllerGetMember = jest
        .spyOn(MembersController.prototype, "getMember")
        //@ts-ignore
        .mockReturnValueOnce(newMember);

      const { statusCode } = await supertest(app)
        .post("/members")
        .send(newMember);

      expect(statusCode).toBe(200);
    });
  });

  describe("Get specific Member", () => {
    it("should return a 200 status code, and the member from db when there is an availableMember", async () => {
      const mockMembersController = jest
        .spyOn(MembersController.prototype, "getMember")
        //@ts-ignore
        .mockReturnValueOnce(mockMember);

      const { statusCode, body } = await supertest(app).get("/members/1");
      expect(body).toEqual(mockMember);

      expect(statusCode).toBe(200);

      expect(mockMembersController).toHaveBeenCalledTimes(1);
    });

    it("should return invalid status when ther is no member that matches", async () => {
      const mockMembersController = jest
        .spyOn(MembersController.prototype, "getMember")
        //@ts-ignore
        .mockReturnValueOnce(null);

      const { statusCode } = await supertest(app).get("/members/1");

      expect(statusCode).toBe(404);

      expect(mockMembersController).toHaveBeenCalledTimes(1);
    });

    it("should return 500 error when the database fails", async () => {
      const mockMembersController = jest
        .spyOn(MembersController.prototype, "getMember")
        //@ts-ignore
        .mockRejectedValueOnce("Rejecting");

      const { statusCode } = await supertest(app).get("/members/1");

      expect(statusCode).toBe(500);

      expect(mockMembersController).toHaveBeenCalledTimes(1);
    });
  });
});
