import { pool } from "../utils";
import { RowDataPacket } from "mysql2";
import { EventType, parseEventType } from "../types/event";
import {
  HydratedAttendanceType,
  parseDataToHydratedAttendanceType,
} from "../types/attendance";

export class RecordController {
  async getRecordForMember(id: string) {
    const [data] = await pool.query(
      `SELECT * FROM AttendanceRecord JOIN Event ON AttendanceRecord.event_id = Event.uuid WHERE person_id = ?`,
      [id]
    );

    const parsedRowData = data as RowDataPacket[];
    const record = parsedRowData
      .map((record): HydratedAttendanceType | null => {
        try {
          const typedRecord = parseDataToHydratedAttendanceType(record);
          return typedRecord as HydratedAttendanceType;
        } catch (err) {
          return null;
        }
      })
      .filter((record) => record !== null);

    return record;
  }
}
