import supertest from "supertest";
import { createServer } from "../src/utils";
import AttendanceController from "../src/controllers/attendanceController";

const app = createServer();

const mockAttendanceChange = {
  id: "howr-youd-oing-2day",
  request_type: "absent",
  reason: "just suz",
  time_submitted: "10:30",
  memberID: "idki-mout-ofid-eas1",
  eventID: "ihop-euli-kemy-ids1",
};

describe("Attendance-Changes tests", () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  describe("Get Attendance Change Route", () => {
    it("should return the mockAttendance when no errors", async () => {
      const attendanceControllerGetAllMembers = jest
        .spyOn(AttendanceController.prototype, "getAllAttendanceChanges")
        // @ts-ignore
        .mockReturnValue(mockAttendanceChange);

      const { statusCode, body } = await supertest(app).get(
        "/attendance-changes"
      );
      expect(statusCode).toBe(200);

      expect(body).toEqual(mockAttendanceChange);

      expect(attendanceControllerGetAllMembers).toHaveBeenCalledTimes(1);
    });

    it("should return multiple AttendanceChanges", async () => {
      const attendanceControllerGetAllMembers = jest
        .spyOn(AttendanceController.prototype, "getAllAttendanceChanges")
        // @ts-ignore
        .mockReturnValue([mockAttendanceChange, mockAttendanceChange]);
      const { statusCode, body } = await supertest(app).get(
        "/attendance-changes"
      );

      expect(statusCode).toBe(200);

      expect(body).toEqual([mockAttendanceChange, mockAttendanceChange]);

      expect(attendanceControllerGetAllMembers).toHaveBeenCalledTimes(1);
    });

    it("should error invalid parameters", async () => {
      const attendanceControllerGetAllMembers = jest
        .spyOn(AttendanceController.prototype, "getSpecificAttendanceChange")
        // @ts-ignore
        .mockReturnValue([mockAttendanceChange, mockAttendanceChange]);
      const { statusCode, body } = await supertest(app)
        .get("/attendance-changes")
        .query({ somethingsomething: "idk" });

      expect(statusCode).toBe(405);
      expect(attendanceControllerGetAllMembers).not.toHaveBeenCalled();
    });

    it("should accept valid parameters and delegate to the proper function", async () => {
      const attendanceControllerGetAllMembers = jest
        .spyOn(AttendanceController.prototype, "getSpecificAttendanceChange")
        // @ts-ignore
        .mockReturnValue(mockAttendanceChange);

      const { statusCode, body } = await supertest(app)
        .get("/attendance-changes")
        .query({ memberID: "areu-keep-ingt-rack" });

      expect(statusCode).toBe(200);

      expect(body).toEqual(mockAttendanceChange);

      expect(attendanceControllerGetAllMembers).toHaveBeenCalledTimes(1);
    });

    it("should not throw 404 erorrs when there is no attendance changes returned from a member", async () => {
      const attendanceControllerGetAllMembers = jest
        .spyOn(AttendanceController.prototype, "getSpecificAttendanceChange")
        // @ts-ignore
        .mockReturnValue([]);

      const { statusCode, body } = await supertest(app)
        .get("/attendance-changes")
        .query({ memberID: "areu-keep-ingt-rack" });

      expect(statusCode).toBe(200);
      expect(body).toEqual([]);
    });

    it("should throw 500 errors when there is a databse error", async () => {
      const attendanceControllerGetAllMembers = jest
        .spyOn(AttendanceController.prototype, "getAllAttendanceChanges")
        // @ts-ignore
        .mockRejectedValueOnce("Rejecting");

      const { statusCode } = await supertest(app).get("/attendance-changes");

      expect(statusCode).toBe(500);
    });
  });

  describe("Post Attendance Change Route", () => {
    const newAttendanceChange = {
      request_type: "absent",
      reason: "just suz",
      time_submitted: "2020-01-01T00:00:00Z",
      memberID: "youh-avep-utth-isto",
      eventID: "geth-eril-lbeh-appy",
    };

    // request_type: z.enum(["absent", "arrive late", "leave early"]),
    // reason: z.string(),
    // time_submitted: z.string().datetime(),
    // arrive_time: z.string().datetime().optional(),
    // leave_time: z.string().datetime().optional(),
    // memberID: z.string(),
    // eventID: z.string()
    const mockAttendanceChangeCreate = jest
      .spyOn(AttendanceController.prototype, "postAttendanceChange")
      // @ts-ignore
      .mockReturnValue(newAttendanceChange);

    it("should throw an error when we add an unecessary field", async () => {
      const invalidJson = {
        request_type: "absent",
        reason: "just suz",
        time_submitted: "2020-01-01T00:00:00Z",
        memberID: "hope-this-data-good",
        eventID: "andv-erya-ccur-ate1",
        unecessaryfield: "what-happ-ened-here",
      };
      const { statusCode } = await supertest(app)
        .post("/attendance-changes")
        .send(invalidJson);

      expect(statusCode).toBe(405);
    });

    it("should throw an error when we are missing a field", async () => {
      const invalidJson = {
        request_type: "absent",
        reason: "just suz",
        time_submitted: "2020-01-01T00:00:00Z",
        eventID: "test-from-seank-star",
      };

      const { statusCode } = await supertest(app)
        .post("/attendance-changes")
        .send(invalidJson);

      expect(statusCode).toBe(405);
    });

    it("should throw an error when we have the wrong type for a field", async () => {
      const invalidJson = {
        request_type: "absent",
        reason: "just suz",
        time_submitted: "2020-01-01T00:00:00Z",
        eventID: 123456789,
        memberID: "test-ingi-sapa-in12",
      };

      const { statusCode } = await supertest(app)
        .post("/attendance-changes")
        .send(invalidJson);

      expect(statusCode).toBe(405);
    });

    it("should go through function and return 200 status when passing a valid object", async () => {
      const { statusCode } = await supertest(app)
        .post("/attendance-changes")
        .send(newAttendanceChange);

      expect(statusCode).toBe(200);
    });
  });

  describe("Get specific Attendance Change Route", () => {
    it("should return the same mockAttendance Change", async () => {
      const attendanceChangeControllerGetMember = jest
        .spyOn(AttendanceController.prototype, "getAttendanceChange")
        // @ts-ignore
        .mockReturnValue(mockAttendanceChange);

      const { statusCode, body } = await supertest(app).get(
        "/attendance-changes/1"
      );
      expect(statusCode).toBe(200);

      expect(body).toEqual(mockAttendanceChange);

      expect(attendanceChangeControllerGetMember).toHaveBeenCalledTimes(1);
    });

    it("should return 500 status when there is a db error", async () => {
      const attendanceChangeControllerGetMember = jest
        .spyOn(AttendanceController.prototype, "getAttendanceChange")
        // @ts-ignore
        .mockRejectedValueOnce("Rejecting");

      const { statusCode } = await supertest(app).get("/attendance-changes/1");
      expect(statusCode).toBe(500);

      expect(attendanceChangeControllerGetMember).toHaveBeenCalledTimes(1);
    });
  });
});
