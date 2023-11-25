import { VercelRequest, VercelResponse } from '@vercel/node';
import AttendanceController from '../../src/controllers/attendanceController'
import { AttendanceSchema } from '../../src/types/types'
import { z } from 'zod';

const attendanceController = new AttendanceController();

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const result = AttendanceSchema.parse(req.body);
    const insertedItem = await attendanceController.postAttendanceChange(result);
    res.status(200).send(insertedItem);
  } catch (error) {
    error instanceof z.ZodError
      ? res.status(405).send("Invalid Input")
      : res.status(500).send("Database Error");
  }
};