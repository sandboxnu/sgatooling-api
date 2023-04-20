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

  /**
   * Function for the GET / endpoint. 
   * @param urlArgs:
   * limit=n - get the n most recent AttendanceChange requests
   * memberID=id - gets the records associated with the Member with ID id
   * eventID=id - gets the records associated with the Event with ID eventID
   * @returns Attendance data depending on arguments passed in the URL. 
   */
  async getSpecificAttendanceChange(urlArgs) {
    if (isEmpty(urlArgs)) {
      return this.getAllAttendanceChanges();
    }

    //need values from only from AttendanceChangeRequests:
    let SELECT =
      " SELECT name, time_submitted, date_of_change, type, change_status, reason, time_arriving, time_leaving";
    let FROM = " FROM AttendanceChangeRequest ACR";
    let JOIN = "";
    let WHERE = "";
    let LIMIT = "";
    let data = [];

    for (let i = 0; i < Object.keys(urlArgs).length; i++) {
      let currentKey = Object.keys(urlArgs)[i];
      if (
        currentKey !== "memberID" &&
        currentKey !== "eventID" &&
        currentKey !== "limit"
      ) {
        throw new Error("unsupported");
      }

      if (currentKey === "eventID") {
        //if where is not null, works if we already have an existing event:
        if (WHERE) {
          WHERE += " AND event_id = ?";
        } else {
          JOIN += " JOIN Report R on R.request_id = ACR.uuid";
          WHERE += " WHERE event_id = ?";
        }
        data.push(urlArgs[currentKey]);
      }

      if (currentKey === "memberID") {
        if (WHERE) {
          WHERE += " AND person_uuid = ?";
        } else {
          JOIN += " JOIN Report R on R.request_id = ACR.uuid";
          WHERE += " WHERE person_uuid = ?";
        }
        data.push(urlArgs[currentKey]);
      }
    }

    if (urlArgs.hasOwnProperty("limit")) {
      LIMIT += " LIMIT ?";
      data.push(parseInt(urlArgs["limit"]));
    }

    const totalQuery = SELECT + FROM + JOIN + WHERE + LIMIT;
    console.log(totalQuery);
    const [result] = await pool.query(totalQuery, data);
    return [result];
  }

  //should we use joi before entering here, or is it alright if the database fails to input by itself and we catch that in the routes?
  async postAttendanceChange(attendance) {
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

    const totalString = initialQuery + initialValue;
    console.log(totalString);
    const [result] = await pool.query(totalString, Object.values(attendance));

    const attendanceChange = await pool.query(
      "SELECT * FROM AttendanceChangeRequest WHERE uuid = ?",
      [attendance.uuid]
    );

    return attendanceChange;
  }
}

export default AttendanceController;
