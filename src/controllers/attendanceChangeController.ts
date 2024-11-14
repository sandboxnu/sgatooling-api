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
    const parsedData = await this.prisma.attendanceChangeRequest.findMany();

    const AttendanceChanges = parsedData
      .map((attendance) => {
        try {
          const parsedAttendance = parseDataToAttendanceChangeType(attendance);
          return parsedAttendance;
        } catch (err) {
          return null;
        }
      })
      .filter(Boolean);

    return AttendanceChanges;
  }

  async getAttendanceChange(id: string) {
    const data = await this.prisma.attendanceChangeRequest.findMany({
      where: {
        uuid: id
      }
    })

    const AttendanceChange = parseDataToAttendanceChangeType(data[0]);
    return AttendanceChange;
  }

  async getSpecificAttendanceChange(urlArgs: AttendanceQueryType) {
    let eventID = "";
    let memberID = "";
    let limit;

    if (urlArgs.hasOwnProperty("eventId")) {
      eventID += urlArgs["eventId"];
    }

    if (urlArgs.hasOwnProperty("memberId")) {
      memberID += urlArgs["memberId"];
    }

    if (urlArgs.hasOwnProperty("limit")) {
      limit = parseInt(urlArgs["limit"] as string);
    }

    const result = await this.prisma.attendanceChangeRequest.findMany({
      where :{
        member_id: memberID ?? undefined,
        event_id: eventID ?? undefined,
      },
      take: limit ?? undefined
    })

    // the user has no Attendance Changes
    if (!result) {
      return [];
    }

    const AttendanceChanges = result
      .map((attendance) => {
        try {
          const parsedAttendance = parseDataToAttendanceChangeType(attendance);
          return parsedAttendance;
        } catch (err) {
          return null;
        }
      })
      .filter(Boolean);

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
