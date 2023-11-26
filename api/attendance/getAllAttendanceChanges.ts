


import { VercelRequest, VercelResponse } from '@vercel/node'
import { isEmpty } from "../../src/utils"
import { z, ZodError } from "zod";
import { AttendanceQuery } from "../../src/types/types"
import AttendanceController from "../../src/controllers/attendanceController"

const attendanceController = new AttendanceController();

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    let people;
    if (isEmpty(req.query)) {
      people = await attendanceController.getAllAttendanceChanges();
    } else {
      const result = AttendanceQuery.parse(req.query);
      people = await attendanceController.getSpecificAttendanceChange(result);
    }
    res.status(200).send(people);
  } catch (error: unknown) {
    error instanceof ZodError
      ? res.status(400).send("Invalid Input")
      : res.status(500).send("Database Error");
  }
};