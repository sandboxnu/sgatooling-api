// Controller class for the Attendance API endpoints
import { RowDataPacket } from "mysql2";
import { pool } from "../utils";
import { Attendance, parseDataToAttendanceType } from "../types/attendance";

class AttendanceController {
  async getAttendance(memberId: string, eventId: string) {
    const [data] = await pool.query(
      "SELECT * FROM AttendanceRecord WHERE person_id = ? AND event_id = ?",
      [memberId, eventId]
    );

    const parsedData = (data as RowDataPacket)[0];
    return parseDataToAttendanceType(parsedData);
  }

  async postAttendance(attendance: Attendance) {
    let initialQuery =
      "INSERT INTO AttendanceRecord (person_id, event_id, attendance_status) VALUES (?, ?, ?)";
    await pool.query(initialQuery, [
      attendance.memberId,
      attendance.eventId,
      attendance.attendanceStatus,
    ]);
    return this.getAttendance(attendance.memberId, attendance.eventId);
  }
}

export default AttendanceController;
