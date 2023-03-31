// EventRepository
// Class that accesses the repository (MySQL database) and pulls data from it.

import dotenv from "dotenv";
dotenv.config();
import * as mysql2 from "mysql2";
import { Event } from "../types/eventType.js";
import localDb from "../local_db.js";
import { pool } from "../controllers/memberController.js";
// import local database from the database thingy

class EventsRepository {
  // Gets the list of all the events
  async getAllEvents() {
  }

  getEvent(id: string): Event | undefined {
    // borderline pseudocode that gets the events from the database.
    const eventsMap = localDb["players"];

    const event = eventsMap[id];
    return event;
  }
}

export default EventsRepository;
