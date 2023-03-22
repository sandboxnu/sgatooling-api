// Controller class for the Attendance API endpoints

import HTTPError from "../errors/HTTPError.js";
import AttendanceRepository from "../repository/attendanceRepository.js";
import { Attendance } from "../types/attendanceType.js";

const attendanceRepository = new AttendanceRepository(); 

class AttendanceController {
  getAllAttendanceChanges(): Attendance[] {
    return attendanceRepository.getAllAttendanceChanges();
  }

  getAttendanceChange(id: string) : Attendance {
    const attendanceChange = attendanceRepository.getAttendanceChange(id); 

    if (!attendanceChange) {
      throw new HTTPError("Attendance change not found.", 400);
    }

    return attendanceChange; 
  }

  postAttendanceChange(Attendance attendance) {

  }
}

export default AttendanceController; 