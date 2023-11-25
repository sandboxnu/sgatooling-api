import { VercelRequest, VercelResponse } from '@vercel/node';
import AttendanceController from "../../src/controllers/attendanceController";

const attendanceController = new AttendanceController();

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const attendanceId = req.query["attendanceId"];
    if (Array.isArray(attendanceId)) {
      res.status(400).send("Attendance ID contains incorrect information")
    } else {
      const attendance = await attendanceController.getAttendanceChange(attendanceId);
      res.status(200).send(attendance);
    }
  } catch (error) {
    res.status(500).send("Database Error");
  }
};