// Attendance Routes 
// Route implementation for attendance api endpoints
// Routes calls a controller which calls the repo which calls the db

import AttendanceController from "../controllers/attendanceController.js";
import express from "express";
const router = express.Router(); 

const attendanceController = new AttendanceController(); 

/* GET all attendance changes */
router.get("/", (req, res, next) => {
  try {
    const attendanceList = attendanceController.getAllAttendanceChanges();
    res.status(200).json(attendanceList); 
  } catch (err: unknown) {
    next(err); 
  }
});

/* GET attendance change for specific id */ 
router.get("/:attendanceId", (req, res, next) => {
  try {
    const attendanceId = req.params["attendanceId"]; 
    const attendance = attendanceController.getAttendanceChange(attendanceId); 
    res.status(200).json(event); 
  } catch (err: unknown) {
    next(err); 
  }
});

/* POST attendance change */
router.post("/", (req, res, next) => {
  try {
    // set up attendance 
    const attendance = (pull it from the post data);  

    // verify post data is correct

    // use the controller 
    attendanceController.postAttendanceChange(attendance);  
  } catch (err: unknown) {
    next(err); 
  }
});  

module.exports = router; 