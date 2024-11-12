import { RowDataPacket } from "mysql2";
import { createdRandomUID, pool } from "../utils";
import { AttendanceQueryType } from "../types/attendance";
import {
  parseDataToAttendanceChangeType,
  AttendanceChangeCreate,
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

  async postAttendanceChange(attendanceChange: AttendanceChangeCreate) {
    //generate the UUID(the API is responsible for creating this)
    const randomuuid = createdRandomUID();
    //change_status is given to be pending since its just created
    let query =
      "INSERT INTO AttendanceChangeRequest (uuid, change_status, name, time_submitted, date_of_change, type, reason, time_arriving, time_leaving, event_id, member_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [randomuuid, "pending"].concat(
      Object.values(attendanceChange)
    );
    await pool.query(query, values);

    //subsequent query to get the information of the item we just inserted
    const insertedAttendanceChange = this.getAttendanceChange(randomuuid);

    return insertedAttendanceChange;
  }
}

export default AttendanceChangeController;
