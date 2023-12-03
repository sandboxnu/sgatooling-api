import { pool } from "../utils";

export class RecordController {
  async getRecordForMember(id: string) {
    const [record] = await pool.query(
      `SELECT * FROM AttendanceRecord WHERE person_id = ?`,
      [id]
    );
    return record;
  }

  async getEventsForMemberRecord(id: string) {
    const [events] = await pool.query(
      `SELECT uuid, event_name, start_time, end_time,sign_in_closed FROM AttendanceRecord JOIN Event where person_id = ?`,
      [id]
    );

    return events;
  }
}
