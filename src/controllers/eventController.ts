// Controller class for the Event API endpoints
// The controller has a class and method that call the repository.
import { pool } from "../utils";
import { RowDataPacket } from "mysql2";
import { parseDataToEventType } from "../types/types";

class EventsController {
  async getAllEvents() {
    const [data] = await pool.query("SELECT * FROM Event");

    const parsedRowData = data as RowDataPacket[];
    const Events = parsedRowData
      .map((event) => {
        try {
          const parsedEvent = parseDataToEventType(event);
          return parsedEvent;
        } catch (err) {
          return null;
        }
      })
      .filter(Boolean);

    return Events;
  }

  async getEvent(id: string) {
    const [data] = await pool.query(`SELECT * FROM Event WHERE uuid = ?`, [id]);

    const parsedRowData = (data as RowDataPacket)[0];
    const Event = parseDataToEventType(parsedRowData);

    return Event;
  }
}

export default EventsController;
