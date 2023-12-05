import { pool } from "../utils";
import { RowDataPacket } from "mysql2";
import {
  AttendanceRecordSchema,
  AttendanceRecord,
  EventSchema,
  Event,
} from "../types/types";

export class RecordController {
  async getRecordForMember(id: string) {
    const [data] = await pool.query(
      `SELECT * FROM AttendanceRecord WHERE person_id = ?`,
      [id]
    );

    const parsedRowData = data as RowDataPacket[];
    const record = parsedRowData.map((record) => {
      try {
        const typedRecord = AttendanceRecordSchema.parse({
          person_id: record.person_id,
          event_id: record.event_id,
          attendance_status: record.attendance_status,
        });
        return typedRecord as AttendanceRecord;
      } catch (err) {
        return null;
      }
    });

    return record;
  }

  async getEventsForMemberRecord(id: string) {
    const [data] = await pool.query(
      `SELECT uuid, event_name, start_time, end_time, sign_in_closed, description, location FROM AttendanceRecord JOIN Event ON AttendanceRecord.event_id = Event.uuid where person_id = ?`,
      [id]
    );

    const parsedRowData = data as RowDataPacket[];
    const record = parsedRowData.map((event) => {
      try {
        const typedEvent = EventSchema.parse({
          uuid: event.uuid,
          event_name: event.event_name,
          ...(event.start_time && { start_time: event.start_time }),
          ...(event.end_time && { end_time: event.end_time }),
          sign_in_closed: !!event.sign_in_closed,
          description: event.description,
          location: event.location,
        });
        return typedEvent as Event;
      } catch (err) {
        return null;
      }
    });

    return record;
  }
}
