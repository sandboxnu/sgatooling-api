//Types and Schemas for the database
import { z } from "zod";

//Member
export const MemberSchema = z
  .object({
    //uuid still remains, and now we add in nuid field
    uuid: z.string(),
    nuid: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string(),
    active_member: z.boolean(),
    can_vote: z.boolean(),
    include_in_quorum: z.boolean(),
    receive_email_notifs: z.boolean(),
    can_log_in: z.boolean(),
  })
  //strict makes sure that these are the only valid parameters, and nothing else gets included that's rubbish
  .strict();

export type Member = z.infer<typeof MemberSchema>;

//Query Params for Members
//for some reason they are formatted in JSON something like { active: ''}, so we use another object to validate with optionals for each
export const MemberQuery = z
  .object({
    group: z.string().optional(),
    active: z.string().optional(),
    //hyphens are a bit wierd apparently when naming
    "include-in-quorum": z.string().optional(),
  })
  .strict();
export type MQueryType = z.infer<typeof MemberQuery>;

//Events
export const EventSchema = z
  .object({
    id: z.string(),
    event_name: z.string(),
    start_time: z.string().datetime(),
    end_time: z.string().datetime(),
    sign_in_open: z.boolean(),
    event_description: z.string(),
    location: z.string(),
  })
  .strict();

export type Event = z.infer<typeof EventSchema>;

//Attendance
//datetime type may be incorrect/annoying can change later
export const AttendanceSchema = z
  .object({
    request_type: z.enum(["absent", "arrive late", "leave early"]),
    reason: z.string(),
    time_submitted: z.string().datetime(),
    arrive_time: z.string().datetime().optional(),
    leave_time: z.string().datetime().optional(),
    memberID: z.string(),
    eventID: z.string(),
  })
  .strict();

export const AttendanceQuery = z
  .object({
    limit: z.string().optional(),
    memberID: z.string().optional(),
    eventID: z.string().optional(),
  })
  .strict();

export type AQueryType = z.infer<typeof AttendanceQuery>;

export type Attendance = z.infer<typeof AttendanceSchema>;

//AttendanceRecord
export const AttendanceRecord = z
  .object({
    person_id: z.string(),
    event_id: z.string(),
    attendance_status: z.string(),
  })
  .strict();
