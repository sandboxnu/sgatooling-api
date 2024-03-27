import { VercelRequest, VercelResponse } from "@vercel/node";
import AttendanceController from "../../src/controllers/attendanceController";
import { AttendanceReqSchema } from "../../src/types/types";
import { z } from "zod";
import allowCors from "../middleware";

const attendanceController = new AttendanceController();

const postAttendanceChange = async (
  req: VercelRequest,
  res: VercelResponse
) => {
  try {
    const result = AttendanceReqSchema.parse(req.body);
    const newAttendanceChange = await attendanceController.postAttendanceChange(
      result
    );
    res.status(201).json({ attendanceChange: newAttendanceChange });
  } catch (error) {
    error instanceof z.ZodError
      ? res.status(400).send("Invalid Input")
      : res.status(500).send("Database Error");
  }
};

export default allowCors(postAttendanceChange);
