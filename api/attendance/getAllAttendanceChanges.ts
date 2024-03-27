import { VercelRequest, VercelResponse } from "@vercel/node";
import { isEmpty } from "../../src/utils";
import { z, ZodError } from "zod";
import { AttendanceQuery } from "../../src/types/types";
import AttendanceController from "../../src/controllers/attendanceController";
import allowCors from "../middleware";

const attendanceController = new AttendanceController();

const getAllAttendanceChanges = async (
  req: VercelRequest,
  res: VercelResponse
) => {
  try {
    let attendance;
    if (isEmpty(req.query)) {
      attendance = await attendanceController.getAllAttendanceChanges();
    } else {
      const result = AttendanceQuery.parse(req.query);
      attendance = await attendanceController.getSpecificAttendanceChange(
        result
      );
    }
    res.status(200).json(attendance);
  } catch (error: unknown) {
    error instanceof ZodError
      ? res.status(400).send("Invalid Input")
      : res.status(500).send("Database Error");
  }
};

export default allowCors(getAllAttendanceChanges);
