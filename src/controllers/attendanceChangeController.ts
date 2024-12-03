import { createdRandomUID } from "../utils";
import { AttendanceQueryType } from "../types/attendance";
import {
  parseDataToAttendanceChangeType,
  AttendanceChangeCreate,
} from "../types/attendanceChange";
import { PrismaClient } from "@prisma/client";

class AttendanceChangeController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAllAttendanceChanges() {
    const AttendanceChanges = await this.prisma.attendanceChangeRequest.findMany();
    return AttendanceChanges;
  }

  async getAttendanceChange(id: string) {
    const AttendanceChange = await this.prisma.attendanceChangeRequest.findUnique({
      where: {
        uuid: id
      }
    })

    return AttendanceChange;
  }

  async getSpecificAttendanceChange(urlArgs: AttendanceQueryType) {
    const AttendanceChanges = await this.prisma.attendanceChangeRequest.findMany({
      where :{
        member_id: urlArgs["eventId"] ?? undefined,
        event_id: urlArgs["memberId"] ?? undefined,
      },
      take: parseInt(urlArgs["limit"] as string) ?? undefined
    })

    // the user has no Attendance Changes
    if (!AttendanceChanges) {
      return [];
    }
    return AttendanceChanges;
  }

  async postAttendanceChange(attendanceChange: AttendanceChangeCreate) {
    //generate the UUID(the API is responsible for creating this)
    const randomuuid = createdRandomUID();
    //change_status is given to be pending since its just created

    const data = await this.prisma.attendanceChangeRequest.create({
      data: {
        uuid: randomuuid,
        change_status: "pending",
        name: attendanceChange.name,
        time_submitted: attendanceChange.dateOfChange,
        date_of_change: attendanceChange.dateOfChange,
        type: attendanceChange.type,
        reason: attendanceChange.reason,
        time_arriving: attendanceChange.timeArriving,
        time_leaving: attendanceChange.timeLeaving,
        event_id: attendanceChange.eventId,
        member_id: attendanceChange.memberId 
      }
    })

    //subsequent query to get the information of the item we just inserted
    const insertedAttendanceChange = this.getAttendanceChange(randomuuid);

    return insertedAttendanceChange;
  }
}

export default AttendanceChangeController;
