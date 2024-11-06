import { VercelRequest, VercelResponse } from "@vercel/node";
import { RecordController } from "../../src/controllers/recordController";
import { allowCors } from "../middleware";

const recordController = new RecordController();

const getAttendanceRecordForMember = async (
  req: VercelRequest,
  res: VercelResponse
) => {
  try {
    const record = await recordController.getRecordForMember(
      req.query.id as string
    );
    res.status(200).json({ record: record });
  } catch (error: unknown) {
    res.status(500).send("Database Error");
  }
};

export default allowCors(getAttendanceRecordForMember);
