import { VercelRequest, VercelResponse } from '@vercel/node';
import EventsController from "../../src/controllers/eventController";
import { isEmpty } from "../../src/utils"

const eventsController = new EventsController();

/* Gets event data for a given event */
export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const event = await eventsController.getEvent(req.query.id as string);

    if (isEmpty(event)) {
      res.status(404).send("Event Not Found");
      return
    }

    res.status(200).json({event: event});
  } catch (e: unknown) {
    res.status(500).send("Database error");
  }
};
