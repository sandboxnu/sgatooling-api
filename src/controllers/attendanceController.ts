// Controller class for the Attendance API endpoints
import { Attendance, parseDataToAttendanceType } from "../types/attendance";
import { PrismaClient } from "@prisma/client";


class AttendanceController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAttendance(memberId: string, eventId: string) {
    const data = await this.prisma.attendanceRecord.findMany({
      where: {
        event_id: eventId,
        person_id: memberId
      }
    })

    const parsedData = data[0];
    return parseDataToAttendanceType(parsedData);
  }

  async postAttendance(attendance: Attendance) {
    await this.prisma.attendanceRecord.create({
      data: {
        person_id: attendance.memberId,
        event_id: attendance.eventId,
        attendance_status: attendance.attendanceStatus
      }
    })

    return this.getAttendance(attendance.memberId, attendance.eventId);
  }
}

export default AttendanceController;
