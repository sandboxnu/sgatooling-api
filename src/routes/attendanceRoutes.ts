// Attendance Routes
// Route implementation for attendance api endpoints
// Routes calls a controller which calls the repo which calls the db

import AttendanceController from "../controllers/attendanceController.js";
import express from "express";
import { isEmpty } from "./memberRoutes.js";
const attendanceRouter = express.Router();

const attendanceController = new AttendanceController();

/* GET all attendance changes */
attendanceRouter.get("/", async (req, res, next) => {
  let people;
  if (isEmpty(req.query)) {
    people = await attendanceController.getAllAttendanceChanges();
  } else {
    people = await attendanceController.getAttendanceChange(req.query);
  }
  res.send(people);
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
    next(err);
  }
});

/* POST attendance change */
attendanceRouter.post("/", async (req, res, next) => {
  //do joi validation checks later...
  const insertedItem = await attendanceController.postAttendanceChange(
    req.body
  );
  res.status(200).send(insertedItem);
});

export { attendanceRouter };

/*

//req type:

 {
		uuid: "John Doe",
		type: "late",
		change_status: "under review",
		reason: "family emergency",
		time_arriving: 2022-10-31 07:30:00,
		time_leaving: 2022-10-31 08:00:00
	}
*/
