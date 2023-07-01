// Attendance Routes
// Route implementation for attendance api endpoints
// Routes calls a controller which calls the repo which calls the db

import AttendanceController from "../controllers/attendanceController.js";
import express from "express";
import Joi from "joi";
const attendanceRouter = express.Router();

const attendanceController = new AttendanceController();

/* GET all attendance changes */
attendanceRouter.get("/", async (req, res) => {
  try {
    const people = await attendanceController.getSpecificAttendanceChange(
      req.query
    );
    res.status(200).send(people);
  } catch (error: unknown) {
    res.status(500).send("Database Error");
  }
});

/* GET attendance change for specific id */
attendanceRouter.get("/:attendanceId", async (req, res, next) => {
  try {
    const attendanceId = req.params["attendanceId"];
    const attendance = await attendanceController.getAttendanceChange(
      attendanceId
    );
    res.status(200).send(attendance);
  } catch (err: unknown) {
    res.status(500).send("Database Error");
  }
});

/* POST attendance change */

attendanceRouter.post("/", async (req, res) => {
  const schema = Joi.object({
    request_type: Joi.string()
      .valid("absent", "arrive late", "leave early")
      .required(),
    reason: Joi.string(),
    //idk why but date().timestamp() doesn't match the typical format from the api spec so string is used for now...
    //TODO: try out joi/date
    time_submitted: Joi.string(),
    arrive_time: Joi.string(),
    leave_time: Joi.string(),
    memberID: Joi.string().required(),
    eventID: Joi.string().required(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    res.status(405).send("Invalid Input");
    return;
  }
  try {
    const insertedItem = await attendanceController.postAttendanceChange(
      req.body
    );
    res.status(200).send(insertedItem);
  } catch (error: unknown) {
    res.status(500).send("Database Error");
  }
});

export { attendanceRouter };
