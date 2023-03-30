// Controller class for the Event API endpoints
// The controller has a class and method that call the repository.

// are these imports supposed to have .js extension?
import HTTPError from "../errors/HTTPError.js";
import EventsRepository from "../repository/eventRepository.js";
import { pool } from "../controllers/memberController.js";

const eventsRepository = new EventsRepository();

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
