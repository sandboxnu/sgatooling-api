import { VercelRequest, VercelResponse } from "@vercel/node";
import { z } from "zod";
import { allowCors } from "../middleware";
import AttendanceChangeController from "../../src/controllers/attendanceChangeController";
import { AttendanceChangeRequestSchema } from "../../src/types/attendanceChange";

const attendanceChangeController = new AttendanceChangeController();

const postAttendanceChange = async (
  req: VercelRequest,
  res: VercelResponse
) => {
  try {
    const result = AttendanceChangeRequestSchema.parse(req.body);
    const newAttendanceChange =
      await attendanceChangeController.postAttendanceChange(result);
    res.status(201).json({ attendanceChange: newAttendanceChange });
  } catch (error) {
    console.log(error);
    error instanceof z.ZodError
      ? res.status(400).send("Invalid Input")
      : res.status(500).send("Database Error");
  }
};

export default allowCors(postAttendanceChange);
