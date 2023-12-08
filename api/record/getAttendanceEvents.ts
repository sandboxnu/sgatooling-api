import { VercelRequest, VercelResponse } from "@vercel/node";
import { RecordController } from "../../src/controllers/recordController";

const recordController = new RecordController();

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const events = await recordController.getEventsForMemberRecord(
      req.query.id as string
    );
    res.status(200).json({ events: events });
  } catch (error: unknown) {
    res.status(500).send("Database Error");
  }
};
