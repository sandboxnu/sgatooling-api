import { VercelRequest, VercelResponse } from "@vercel/node";
import { isEmpty } from "../../src/utils";
import { ZodError } from "zod";
import { allowCors } from "../middleware";
import AttendanceChangeController from "../../src/controllers/attendanceChangeController";
import { parseAttendanceQueryType } from "../../src/types/attendance";

const attendanceChangeController = new AttendanceChangeController();

const getAllAttendanceChanges = async (
  req: VercelRequest,
  res: VercelResponse
) => {
  try {
    let attendance;
    if (isEmpty(req.query)) {
      attendance = await attendanceChangeController.getAllAttendanceChanges();
    } else {
      const result = parseAttendanceQueryType(req.query);
      attendance = await attendanceChangeController.getSpecificAttendanceChange(
        result
      );
    }
    res.status(200).json(attendance);
  } catch (error: unknown) {
    error instanceof ZodError
      ? res.status(400).send(error)
      : res.status(500).send("Database Error");
  }
};

export default allowCors(getAllAttendanceChanges);
