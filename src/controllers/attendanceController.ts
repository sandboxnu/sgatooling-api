// Controller class for the Attendance API endpoints
import { Attendance } from "../types/types";
import { AQueryType } from "../types/types";
import { pool, createdRandomUID } from "../utils";

class AttendanceController {
  async getAllAttendanceChanges() {
    const [result] = await pool.query("SELECT * FROM AttendanceChangeRequest");
    return result;
  }

  async getAttendanceChange(id: string) {
    const [result] = await pool.query(
      "SELECT * FROM AttendanceChangeRequest WHERE uuid = ?",
      [id]
    );
    return result;
  }

  async getSpecificAttendanceChange(urlArgs: AQueryType) {
    let SELECTFROM = "SELECT * FROM AttendanceChangeRequest";
    let WHERE = "";
    let LIMIT = "";
    let data = [];

    const validParams = new Map([
      ["eventID", "eventID = ?"],
      ["memberID", "memberID = ?"],
      ["limit", "LIMIT ?"],
    ]);

    for (let i = 0; i < Object.keys(urlArgs).length; i++) {
      let currentKey: string = Object.keys(urlArgs)[i];
      if (validParams.has(currentKey) && currentKey != "limit") {
        if (WHERE) {
          WHERE += " AND " + validParams.get(currentKey);
        } else {
          WHERE += " WHERE " + validParams.get(currentKey);
        }
        // was giving some really annoying errors about string| undefined types
        // not a solution but stops the type error.
        // @ts-ignore
        data.push(urlArgs[currentKey]);
      }
    }

    if (urlArgs.hasOwnProperty("limit")) {
      LIMIT += " LIMIT ?";
      // non-null assertion since we just checked if the urlArgs has this key
      data.push(parseInt(urlArgs["limit"] as string));
    }

    const totalQuery = SELECTFROM + WHERE + LIMIT;
    const [result] = await pool.query(totalQuery, data);
    return result;
  }

  async postAttendanceChange(attendance: Attendance) {
    //generate the UUID(the API is responsible for creating this)
    const randomuuid = createdRandomUID();
    //change_status is given to be pending since its just created
    let initialQuery =
      "INSERT INTO AttendanceChangeRequest (id, change_status, ";
    let initialValue = " Values (?, ?, ";

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
    const newValues = [randomuuid, "pending"].concat(Object.values(attendance));
    //initial query to insert the item in the db
    const [result] = await pool.query(totalString, newValues);

    //subsequent query to get the information of the item we just inserted
    const [attendanceChange] = await pool.query(
      "SELECT * FROM AttendanceChangeRequest WHERE id = ?",
      [randomuuid]
    );

    return attendanceChange;
  }
}

export default AttendanceController;
