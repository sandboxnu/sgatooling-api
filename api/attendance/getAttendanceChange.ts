import { VercelRequest, VercelResponse } from "@vercel/node";
import AttendanceChangeController from "../../src/controllers/attendanceChangeController";

const attendanceChangeController = new AttendanceChangeController();

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const attendance = await attendanceChangeController.getAttendanceChange(
      req.query.id as string
    );
    res.status(200).json({ attendance: attendance });
  } catch (error) {
    res.status(500).send("Database Error");
  }
};
