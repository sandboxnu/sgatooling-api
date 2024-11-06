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
      `SELECT * FROM AttendanceRecord WHERE person_id = ? JOIN Event ON AttendanceRecord.event_id = Event.uuid`,
      [id]
    );

    const parsedRowData = data as RowDataPacket[];
    const record = parsedRowData
      .map((record): AttendanceRecord | null => {
        try {
          const typedRecord = AttendanceRecordSchema.parse({
            memberId: record.person_id,
            attendanceStatus: record.attendance_status,
            event: EventSchema.parse({
              id: record.event_id,
              eventName: record.event_name,
              ...(record.start_time && {
                startTime: new Date(record.start_time),
              }),
              ...(record.end_time && { endTime: new Date(record.end_time) }),
              signInClosed: !!record.sign_in_closed,
              description: record.description,
              location: record.location,
              membershipGroup: record.membership_group,
            }),
          });
          return typedRecord as AttendanceRecord;
        } catch (err) {
          return null;
        }
      })
      .filter((record) => record !== null);

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
