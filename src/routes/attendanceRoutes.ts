// Attendance Routes
// Route implementation for attendance api endpoints
// Routes calls a controller which calls the repo which calls the db

import AttendanceController from "../controllers/attendanceController.js";
import express from "express";
import { isEmpty } from "./memberRoutes.js";
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
    res.status(200).json(attendance);
  } catch (err: unknown) {
    res.status(500).send("Database Error");
  }
});

/* POST attendance change */
attendanceRouter.post("/", async (req, res) => {
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

/*

//req type:

{"uuid":"02623027b2d379be85ff0ac2dc2feeef",
"name":"Jenny Kim",
"time_submitted":"2022-11-22 11:50:50",
"date_of_change":"2022-11-28 00:00:00",
"type":"absent",
"change_status":"excused",
"reason":" Hello test1 from seank"
}
*/
