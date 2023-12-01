import { VercelRequest, VercelResponse } from '@vercel/node';
import EventsController from "../../src/controllers/eventController";

const eventsController = new EventsController();

/* GET all events. */
export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const eventsList = await eventsController.getAllEvents();
    res.status(200).json(eventsList);
  } catch (err: unknown) {
    res.status(500).send("Database Error");
  }
};
