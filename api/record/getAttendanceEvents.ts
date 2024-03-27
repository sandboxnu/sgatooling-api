import { VercelRequest, VercelResponse } from "@vercel/node";
import { RecordController } from "../../src/controllers/recordController";
import allowCors from "../middleware";

const recordController = new RecordController();

const getAttendanceEvents = async (req: VercelRequest, res: VercelResponse) => {
  try {
    const events = await recordController.getEventsForMemberRecord(
      req.query.id as string
    );
    res.status(200).json({ events: events });
  } catch (error: unknown) {
    res.status(500).send("Database Error");
  }
};

export default allowCors(getAttendanceEvents);
