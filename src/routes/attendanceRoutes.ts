// Attendance Routes 
// Route implementation for attendance api endpoints
// Routes calls a controller which calls the repo which calls the db

import AttendanceController from "../controllers/attendanceController.js";
import express from "express";
const router = express.Router(); 

const attendanceController = new AttendanceController(); 

