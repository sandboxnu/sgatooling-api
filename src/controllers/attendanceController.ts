// Controller class for the Attendance API endpoints
import { Attendance } from "../types/attendanceType.js";
import { pool } from "../controllers/memberController.js";
import { isEmpty } from "../routes/memberRoutes.js";

class AttendanceController {
  async getAllAttendanceChanges() {
    const [result] = await pool.query("SELECT * FROM AttendanceChangeRequest");
    return result;
  }

  async getAttendanceChange(id) {
    const [result] = await pool.query(
      "SELECT * FROM AttendanceChangeRequest WHERE uuid = ?",
      [id]
    );
    return result;
  }

  async getSpecificAttendanceChange(urlArgs) {
    if (isEmpty(urlArgs)) {
      return this.getAllAttendanceChanges();
    }

    let SELECT =
      " SELECT name, time_submitted, date_of_change, type, change_status, reason, time_arriving, time_leaving";
    let FROM = " FROM AttendanceChangeRequest ACR";
    let JOIN = "";
    let WHERE = "";
    let LIMIT = "";
    let data = [];

    const validParams = new Map([
      ["eventID", "event_id = ?"],
      ["memberID", "person_uuid = ?"],
      ["limit", " LIMIT ?"],
    ]);

    for (let i = 0; i < Object.keys(urlArgs).length; i++) {
      let currentKey: string = Object.keys(urlArgs)[i];
      if (!validParams.has(currentKey)) {
        throw new Error("unsupported Key");
      }

      if (currentKey === "eventID") {
        if (WHERE) {
          WHERE += " AND event_id = ?";
        } else {
          JOIN += " JOIN Report R on R.request_id = ACR.uuid";
          WHERE += " WHERE " + validParams.get(currentKey);
        }
        data.push(urlArgs[currentKey]);
      }

      if (currentKey === "memberID") {
        if (WHERE) {
          WHERE += " AND person_uuid = ?";
        } else {
          JOIN += " JOIN Report R on R.request_id = ACR.uuid";
          WHERE += " WHERE " + validParams.get(currentKey);
        }
        data.push(urlArgs[currentKey]);
      }
    }

    if (urlArgs.hasOwnProperty("limit")) {
      LIMIT += validParams.get("limit");
      data.push(parseInt(urlArgs["limit"]));
    }

    const totalQuery = SELECT + FROM + JOIN + WHERE + LIMIT;
    const [result] = await pool.query(totalQuery, data);
    return [result];
  }

  async postAttendanceChange(attendance) {
    //create the initial Attendance Change Request
    let initialQuery = "INSERT INTO AttendanceChangeRequest (";
    let initialValue = " Values (";

    const keys = Object.keys(attendance);
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

    //TODO: fix this to not use uuid, since the user is not likely sending this
    const attendanceChange = await pool.query(
      "SELECT * FROM AttendanceChangeRequest WHERE uuid = ?",
      [attendance.uuid]
    );

    return attendanceChange;
  }
}

export default AttendanceController;
