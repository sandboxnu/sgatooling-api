import { VercelRequest, VercelResponse } from "@vercel/node";
import EventsController from "../../src/controllers/eventController";
import allowCors from "../middleware";

const eventsController = new EventsController();

/* GET all events. */
const getAllEvents = async (req: VercelRequest, res: VercelResponse) => {
  try {
    const eventsList = await eventsController.getAllEvents();
    res.status(200).json(eventsList);
  } catch (err: unknown) {
    res.status(500).send("Database Error");
  }
};

export default allowCors(getAllEvents);
