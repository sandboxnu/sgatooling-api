// Controller class for the Event API endpoints
// The controller has a class and method that call the repository.
import { pool } from "../utils";

class EventsController {
  async getAllEvents() {
    const [result] = await pool.query("SELECT * FROM Event");
    return result;
  }

  async getEvent(id: string) {
    const [result] = await pool.query(`SELECT * FROM Event WHERE uuid = ?`, [
      id,
    ]);
    return result;
  }
}

export default EventsController;
