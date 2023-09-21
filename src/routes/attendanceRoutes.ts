// Attendance Routes
// Route implementation for attendance api endpoints
// Routes calls a controller which calls the repo which calls the db
import express from "express";
import { z } from "zod";
import { AttendanceSchema, AttendanceQuery } from "../types/types";
import { isEmpty } from "../utils";
import AttendanceController from "../controllers/attendanceController";

const attendanceRouter = express.Router();
const attendanceController = new AttendanceController();

/* GET all attendance changes */
attendanceRouter.get("/", async (req, res) => {
  let people;
  try {
    if (isEmpty(req.query)) {
      people = await attendanceController.getAllAttendanceChanges();
    } else {
      const result = AttendanceQuery.parse(req.query);
      people = await attendanceController.getSpecificAttendanceChange(result);
    }
    res.status(200).send(people);
  } catch (error: unknown) {
    error instanceof z.ZodError
      ? res.status(405).send("Invalid Input")
      : res.status(500).send("Database Error");
  }
});

/* GET attendance change for specific id */
attendanceRouter.get("/:attendanceId", async (req, res) => {
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
  try {
    const result = AttendanceSchema.parse(req.body);
    const insertedItem = await attendanceController.postAttendanceChange(
      result
    );
    res.status(200).send(insertedItem);
  } catch (error: unknown) {
    error instanceof z.ZodError
      ? res.status(405).send("Invalid Input")
      : res.status(500).send("Database Error");
  }
});

export { attendanceRouter };
