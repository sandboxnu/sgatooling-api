import { VercelRequest, VercelResponse } from "@vercel/node";
import AttendanceController from "../../src/controllers/attendanceController";
import { z } from "zod";
import { allowCors } from "../middleware";
import { parseAttendanceType } from "../../src/types/attendance";

const attendanceController = new AttendanceController();

const postAttendance = async (req: VercelRequest, res: VercelResponse) => {
  try {
    const result = parseAttendanceType(req.body);
    const newAttendanceChange = await attendanceController.postAttendance(
      result
    );
    res.status(201).json({ attendanceChange: newAttendanceChange });
  } catch (error) {
    console.log(error);
    error instanceof z.ZodError
      ? res.status(400).send("Invalid Input")
      : res.status(500).send("Database Error");
  }
};

export default allowCors(postAttendance);
