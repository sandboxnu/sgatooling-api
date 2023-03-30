// AttendanceRepository
// Class that accesses the MySQL db for the attendance endpoints
import { Attendance } from "../types/attendanceType.js";
import localDb from "../local_db.js";
class AttendanceRepository {
  // GET all attendance changes
  getAllAttendanceChanges(): Attendance[] {
    const attendanceMap = localDb["attendance"];

    const attendances: Attendance[] = [];
    for (const id in attendanceMap) {
      attendances.push(attendanceMap[id]);
    }

    return attendances;
  }

  // GET specific attendance change
  getAttendanceChange(id: string): Attendance | undefined {
    const attendanceMap = localDb["attendance"];
    const attendance = attendanceMap[id];
    return attendance;
  }

  // POST attendance information to the DB
  // Returns nothing
  postAttendanceChange(attendance: Attendance) {
    const attendanceMap = localDb["attendance"];
    //attendanceMap.(add the thingy to)(attendanceMap);
  }
}

export default AttendanceRepository;
