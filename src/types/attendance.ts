import { RowDataPacket } from "mysql2";
import { z } from "zod";
import { EventType, parseEventType } from "./event";
import { AttendanceRecord } from "@prisma/client";

const AttendanceSchema = z.object({
  memberId: z.string(),
  eventId: z.string(),
  attendanceStatus: z.enum(["O", "LE"]),
});

const HydratedAttendanceSchema = z
  .object({
    memberId: z.string(),
    attendanceStatus: z.string(),
    event: z.custom<EventType>(),
  })
  .strict();

const AttendanceQuerySchema = z
  .object({
    limit: z.string().optional(),
    memberId: z.string().optional(),
    eventId: z.string().optional(),
  })
  .strict();

export const parseDataToAttendanceType = (data: AttendanceRecord) => {
  const typedAttendance = AttendanceSchema.parse({
    memberId: data.person_id,
    eventId: data.event_id,
    attendanceStatus: data.attendance_status,
  });

  return typedAttendance as Attendance;
};

export const parseDataToHydratedAttendanceType = (data: RowDataPacket) => {
  const typedRecord = HydratedAttendanceSchema.parse({
    memberId: data.person_id,
    attendanceStatus: data.attendance_status,
    event: parseEventType({
      id: data.event_id,
      eventName: data.event_name,
      ...(data.start_time && {
        startTime: new Date(data.start_time),
      }),
      ...(data.end_time && { endTime: new Date(data.end_time) }),
      signInClosed: !!data.sign_in_closed,
      description: data.description,
      location: data.location,
      membershipGroup: data.membership_group,
    }),
  });
  return typedRecord as HydratedAttendanceType;
};

export const parseAttendanceType = (body: any) => {
  const parsedAttendance = AttendanceSchema.parse(body);

  return parsedAttendance as Attendance;
};

export const parseAttendanceQueryType = (body: any) => {
  const parsedQuery = AttendanceQuerySchema.parse(body);

  return parsedQuery as AttendanceQueryType;
};

export type Attendance = z.infer<typeof AttendanceSchema>;
export type HydratedAttendanceType = z.infer<typeof HydratedAttendanceSchema>;
export type AttendanceQueryType = z.infer<typeof AttendanceQuerySchema>;
