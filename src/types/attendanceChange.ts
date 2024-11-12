import { RowDataPacket } from "mysql2";
import { z } from "zod";

//datetime type may be incorrect/annoying can change later
export const AttendanceChangeRequestSchema = z.object({
  id: z.string(),
  name: z.string(),
  timeSubmitted: z.string(),
  dateOfChange: z.string(),
  type: z.enum([
    "absent",
    "arriving late",
    "leaving early",
    "arriving late, leaving early",
  ]),
  changeStatus: z.string(),
  reason: z.string(),
  timeArriving: z.string().optional(),
  timeLeaving: z.string().optional(),
  eventId: z.string(),
  memberId: z.string(),
});

//datetime type may be incorrect/annoying can change later
export const AttendanceChangeRequestCreateSchema =
  AttendanceChangeRequestSchema.partial({
    id: true,
    changeStatus: true,
  });

export const parseDataToAttendanceChangeType = (data: RowDataPacket) => {
  const typedAttendance = AttendanceChangeRequestSchema.parse({
    id: data.uuid,
    name: data.name,
    timeSubmitted: data.time_submitted,
    dateOfChange: data.date_of_change,
    type: data.type,
    changeStatus: data.change_status,
    reason: data.reason,
    ...(data.time_arriving && { timeArriving: data.time_arriving }),
    ...(data.time_leaving && { timeLeaving: data.time_leaving }),
    eventId: data.event_id,
    memberId: data.member_id,
  });

  return typedAttendance as AttendanceChangeRequest;
};

export type AttendanceChangeRequest = z.infer<
  typeof AttendanceChangeRequestSchema
>;

export type AttendanceChangeCreate = z.infer<
  typeof AttendanceChangeRequestCreateSchema
>;
