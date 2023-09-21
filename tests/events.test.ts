import supertest from "supertest";
import { createServer } from "../src/utils";
import EventsController from "../src/controllers/eventController";
import { Event } from "../src/types/types";

const app = createServer();

const mockEvent: Event = {
  id: "some-test-uuid-stri",
  event_name: "Pretty Cool Event",
  start_time: "10:30",
  end_time: "11:30",
  sign_in_open: false,
  event_description: "test event",
  location: "your moms house",
};

describe("Events Routes", () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  describe("Get all events Route", () => {
    it("should return the mock event ", async () => {
      const mockEventControllerGetAllEvents = jest
        .spyOn(EventsController.prototype, "getAllEvents")
        // @ts-ignore
        .mockReturnValue(mockEvent);

      const { statusCode, body } = await supertest(app).get("/events");
      expect(statusCode).toBe(200);

      expect(body).toEqual(mockEvent);

      expect(mockEventControllerGetAllEvents).toBeCalledTimes(1);
    });

    it("should return all the events when there are multiple events", async () => {
      const mockEventControllerGetAllEvents = jest
        .spyOn(EventsController.prototype, "getAllEvents")
        // @ts-ignore
        .mockReturnValue([mockEvent, mockEvent]);

      const { statusCode, body } = await supertest(app).get("/events");
      expect(statusCode).toBe(200);

      expect(body).toEqual([mockEvent, mockEvent]);

      expect(mockEventControllerGetAllEvents).toBeCalledTimes(1);
    });

    it("should return proper error when the db fails", async () => {
      const mockEventControllerGetAllEvents = jest
        .spyOn(EventsController.prototype, "getAllEvents")
        // @ts-ignore
        .mockRejectedValue("Rejecting");

      const { statusCode } = await supertest(app).get("/events");
      expect(statusCode).toBe(500);
    });
  });

  describe("Get individual Event Route", () => {
    it("should return the expected member on call", async () => {
      const mockEventControllerGetEvent = jest
        .spyOn(EventsController.prototype, "getEvent")
        // @ts-ignore
        .mockReturnValue(mockEvent);

      const { statusCode, body } = await supertest(app).get("/events/1");
      expect(statusCode).toBe(200);

      expect(body).toEqual(mockEvent);
    });

    it("should return a 400 error when there is no events with id", async () => {
      const mockEventControllerGetEvent = jest
        .spyOn(EventsController.prototype, "getEvent")
        // @ts-ignore
        .mockReturnValue([]);

      const { statusCode } = await supertest(app).get("/events/1");
      expect(statusCode).toBe(404);
    });

    it("should return a 500 error when the database fails", async () => {
      const mockEventControllerGetEvent = jest
        .spyOn(EventsController.prototype, "getEvent")
        // @ts-ignore
        .mockRejectedValue("Rejecting");

      const { statusCode } = await supertest(app).get("/events/1");
      expect(statusCode).toBe(500);
    });
  });
});
