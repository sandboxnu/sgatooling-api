import { VercelRequest, VercelResponse } from "@vercel/node";
import EventsController from "../../src/controllers/eventController";
import { isEmpty } from "../../src/utils";
import { ZodError } from "zod";
import { allowCors } from "../middleware";

const eventsController = new EventsController();

/* Gets event data for a given event */
const getEvent = async (req: VercelRequest, res: VercelResponse) => {
  try {
    const event = await eventsController.getEvent(req.query.id as string);

    if (isEmpty(event)) {
      res.status(404).send("Event Not Found");
      return;
    }

    res.status(200).json(event);
  } catch (error: unknown) {
    error instanceof ZodError
      ? res.status(400).send("Invalid Input")
      : res.status(500).send("Database error");
  }
};

export default allowCors(getEvent);
