import { VercelRequest, VercelResponse } from "@vercel/node";
import { RecordController } from "../../src/controllers/recordController";
import { PrismaRecordController } from "../../src/controllers/prismaRecordController";
import { allowCors } from "../middleware";

const recordController = new RecordController();

const getAttendanceRecordForMember = async (
  req: VercelRequest,
  res: VercelResponse
) => {
  try {
    let pc = new PrismaRecordController();
    const record = await pc.getRecordForMember(req.query.id as string);
    res.status(200).json(record);
  } catch (error: unknown) {
    res.status(500).send("Database Error");
  }
};

export default allowCors(getAttendanceRecordForMember);
