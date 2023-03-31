// Controller class for the Attendance API endpoints

import HTTPError from "../errors/HTTPError.js";
import AttendanceRepository from "../repository/attendanceRepository.js";
import { Attendance } from "../types/attendanceType.js";
import { pool } from "../controllers/memberController.js";

const attendanceRepository = new AttendanceRepository();

class AttendanceController {
  // GET all attendance changes
  async getAllAttendanceChanges() {
    //return basic select:
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

  // GET specific attendance change
  //JOIN Event ON R.event_id = Event.uuid

  //event_id -> event.uuid

  //SELECT * FROM AttendanceChangeRequest ACR JOIN Report R ON R.request_id = ACR.uuid JOIN Member on R.person_uuid = Member.uuid
  //JOIN Event on R.event_id = Event.id

  //for some reason the events in there isn't any events on those with requests, may ask Chanmi about if this is correct
  async getSpecificAttendanceChange(urlArgs) {
    //need the on clauses otherwise does a cartesian product which is great :))))))))
    let SELECT = " SELECT * ";
    let FROM = " FROM AttendanceChangeRequest ACR";
    let JOIN = "";
    let WHERE = "";
    let LIMIT = "";
    let data = [];

    for (let i = 0; i < Object.keys(urlArgs).length; i++) {
      let currentKey = Object.keys(urlArgs)[i];

      if (currentKey === "eventID") {
        //if where is not null
        if (WHERE) {
          //the events are a big bugged, the only way to
          JOIN += " JOIN Event ON R.event_id = Event.uuid";
          WHERE += " AND Event.uuid = ?";
        } else {
          JOIN +=
            " JOIN Report R ON R.request_id = ACR.uuid JOIN Event ON R.event_id = Event.uuid JOIN AttendanceRecord AR ON Event.uuid = AR.event_id";
          WHERE += " WHERE Event.uuid = ?";
        }
        data.push(urlArgs[currentKey]);
      }

      if (currentKey === "memberID") {
        //if where is not null
        if (WHERE) {
          //join normally
          JOIN += " JOIN Member ON R.person_uuid = Member.uuid";
          WHERE += " AND person_uuid = ?";
        } else {
          JOIN +=
            " JOIN Report R ON R.request_id = ACR.uuid JOIN Member ON R.person_uuid = Member.uuid JOIN AttendanceRecord AR ON Member.uuid = AR.person_id";
          WHERE += " WHERE person_uuid = ?";
        }

        data.push(urlArgs[currentKey]);
      }
    }

    if (urlArgs.hasOwnProperty("limit")) {
      LIMIT += " LIMIT ?";
      data.push(parseInt(urlArgs["limit"]));
    }

    //with the ACR at the end, if nothing matches, it'll return empty which means that there is something malformed,
    const totalQuery = SELECT + FROM + JOIN + WHERE + LIMIT;
    console.log(totalQuery);
    const [result] = await pool.query(totalQuery, data);
    return [result];
  }

  //can use joi for request body validation, and then for each item that we have when we try to make a request, we then case to
  //a string and append onto the insert and then add a resulting items, and then pass in everything total:

  async postAttendanceChange(attendance) {
    let initialQuery = "INSERT INTO AttendanceChangeRequest (";
    let initialValue = "Values (";

    //since fields are optional wanted something that would dynamically update based on inputed
    for (const key of Object.keys(attendance)) {
      (initialQuery += key + ", "), (initialValue += "?, ");
    }

    //it posted, but it didn't do it correctly

    //because of my brilliant design I have to remove the last space and comma for both and put that into sa string
    const totalString =
      initialQuery.slice(0, -2) + ")" + " " + initialValue.slice(0, -2) + ")";
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
