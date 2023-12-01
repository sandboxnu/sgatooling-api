import { VercelRequest, VercelResponse } from '@vercel/node';
import AttendanceController from "../../src/controllers/attendanceController";

const attendanceController = new AttendanceController();

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
      const attendance = await attendanceController.getAttendanceChange(req.query.id as string);
      res.status(200).json({attendance: attendance});
    }
    catch (error) {
    res.status(500).send("Database Error");
  }
};