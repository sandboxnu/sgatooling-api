import { VercelRequest, VercelResponse } from "@vercel/node";
import { allowCors } from "../middleware";
import EventsController from "../../src/controllers/eventController";

const eventsController = new EventsController();

const getAttendanceEvents = async (req: VercelRequest, res: VercelResponse) => {
  try {
    const events = await eventsController.getEventsForMemberRecord(
      req.query.id as string
    );
    res.status(200).json({ events: events });
  } catch (error: unknown) {
    res.status(500).send("Database Error");
  }
};

export default allowCors(getAttendanceEvents);
