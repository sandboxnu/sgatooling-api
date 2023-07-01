// Controller class for the Attendance API endpoints
import { pool, isEmpty, createdRandomUID } from "../utils.js";

class AttendanceController {
  async getAllAttendanceChanges() {
    const [result] = await pool.query("SELECT * FROM AttendanceChangeRequest");
    return result;
  }

  async getAttendanceChange(id) {
    const [result] = await pool.query(
      "SELECT * FROM AttendanceChangeRequest WHERE id = ?",
      [id]
    );
    return result;
  }

  async getSpecificAttendanceChange(urlArgs) {
    if (isEmpty(urlArgs)) {
      return this.getAllAttendanceChanges();
    }

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
      if (!validParams.has(currentKey)) {
        throw new Error("unsupported Key");
      }

      if (validParams.has(currentKey) && currentKey != "limit") {
        if (WHERE) {
          WHERE += " AND " + validParams.get(currentKey);
        } else {
          //JOIN += " JOIN Report R on R.request_id = ACR.uuid";
          WHERE += " WHERE " + validParams.get(currentKey);
        }
        data.push(urlArgs[currentKey]);
      }
    }

    if (urlArgs.hasOwnProperty("limit")) {
      LIMIT += " LIMIT ?";
      data.push(parseInt(urlArgs["limit"]));
    }

    const totalQuery = SELECTFROM + WHERE + LIMIT;
    console.log(totalQuery);
    const [result] = await pool.query(totalQuery, data);
    return result;
  }

  //TODO: getting lint errors with types for these parameters, any suggestions on specifying the type for this to match what I
  //expect would be nice, but idk how that works
  async postAttendanceChange(attendance) {
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
    console.log(totalString);
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
