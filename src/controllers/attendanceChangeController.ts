import { RowDataPacket } from "mysql2";
import { createdRandomUID, pool } from "../utils";
import { AttendanceQueryType } from "../types/attendance";
import {
  parseDataToAttendanceChangeType,
  AttendanceChangeRequest,
} from "../types/attendanceChange";

class AttendanceChangeController {
  async getAllAttendanceChanges() {
    const [data] = await pool.query("SELECT * FROM AttendanceChangeRequest");

    const parsedData = data as RowDataPacket[];
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
    const [data] = await pool.query(
      "SELECT * FROM AttendanceChangeRequest WHERE uuid = ?",
      [id]
    );

    const parsedData = (data as RowDataPacket)[0];

    const AttendanceChange = parseDataToAttendanceChangeType(parsedData);
    return AttendanceChange;
  }

  async getSpecificAttendanceChange(urlArgs: AttendanceQueryType) {
    let SELECTFROM = "SELECT * FROM AttendanceChangeRequest";
    let WHERE = "";
    let LIMIT = "";
    let data = [];

    const validParams = new Map([
      ["eventID", "event_id = "],
      ["memberID", "member_id = "],
      ["limit", "LIMIT "],
    ]);

    Object.entries(urlArgs).forEach(([key, value]) => {
      if (validParams.has(key)) {
        if (WHERE) {
          WHERE += " AND " + validParams.get(key);
        } else {
          WHERE += " WHERE " + validParams.get(key);
        }
        data.push(value);
      }
    });

    if (urlArgs.hasOwnProperty("limit")) {
      LIMIT += " LIMIT ?";
      data.push(parseInt(urlArgs["limit"] as string));
    }

    const totalQuery = SELECTFROM + WHERE + LIMIT;
    const [result] = await pool.query(totalQuery, data);

    // the user has no Attendance Changes
    if (!result) {
      return [];
    }

    const parsedData = result as RowDataPacket[];
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

  async postAttendanceChange(attendanceChangee: AttendanceChangeRequest) {
    //generate the UUID(the API is responsible for creating this)
    const randomuuid = createdRandomUID();
    //change_status is given to be pending since its just created
    let initialQuery =
      "INSERT INTO AttendanceChangeRequest (uuid, change_status, ";
    let initialValue = " Values (?, ?, ";

    const keys = Object.keys(attendanceChangee);
    for (let index = 0; index < keys.length; index++) {
      const item = keys[index];
      //unless we are at the last index:
      if (index !== keys.length - 1) {
        initialQuery += item + ", ";
        initialValue += "?, ";
      } else {
        initialQuery += item + ")";
        initialValue += "?)";
      }
    }

    const totalString = initialQuery + initialValue;
    const newValues = [randomuuid, "pending"].concat(
      Object.values(attendanceChangee)
    );
    await pool.query(totalString, newValues);

    //subsequent query to get the information of the item we just inserted
    const insertedAttendanceChange = this.getAttendanceChange(randomuuid);

    return insertedAttendanceChange;
  }
}

export default AttendanceChangeController;
