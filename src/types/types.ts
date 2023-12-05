//Types and Schemas for the database
import { z } from "zod";
import { RowDataPacket } from "mysql2";

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
    voting_rights: z.boolean(),
    include_in_quorum: z.boolean(),
    receive_not_present_email: z.boolean(),
    sign_in_blocked: z.boolean(),
  })
  //strict makes sure that these are the only valid parameters, and nothing else gets included that's rubbish
  .strict();

export type Member = z.infer<typeof MemberSchema>;

export const parseDataToMemberType = (data: RowDataPacket) => {
  const parsedMember = MemberSchema.parse({
    uuid: data.uuid,
    nuid: data.nuid,
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    active_member: !!data.active_member,
    voting_rights: !!data.voting_rights,
    include_in_quorum: !!data.include_in_quorum,
    receive_not_present_email: !!data.receive_not_present_email,
    sign_in_blocked: !!data.sign_in_blocked,
  });

  return parsedMember as Member;
};

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

export const MemberGroupSchema = z.object({
  person_id: z.string(),
  membership_group: z.string(),
});

export type MemberGroupType = z.infer<typeof MemberGroupSchema>;

//Events
export const EventSchema = z
  .object({
    uuid: z.string(),
    event_name: z.string(),
    start_time: z.string().optional(),
    end_time: z.string().optional(),
    sign_in_closed: z.boolean(),
    description: z.string(),
    location: z.string(),
  })
  .strict();

export type Event = z.infer<typeof EventSchema>;

export const parseDataToEventType = (data: RowDataPacket) => {
  const typedEvent = EventSchema.parse({
    uuid: data.uuid,
    event_name: data.event_name,
    ...(data.start_time && { start_time: data.start_time }),
    ...(data.end_time && { end_time: data.end_time }),
    sign_in_closed: !!data.sign_in_closed,
    description: data.description,
    location: data.location,
  });
  return typedEvent as Event;
};

//Attendance
//datetime type may be incorrect/annoying can change later
export const AttendanceSchema = z
  .object({
    type: z.enum(["absent", "arriving late", "leaving early"]),
    reason: z.string(),
    time_submitted: z.string(),
    arrive_time: z.string().optional(),
    leave_time: z.string().optional(),
    member_id: z.string(),
    event_id: z.string(),
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

export const parseDataToAttendanceType = (data: RowDataPacket) => {
  const typedAttendance = AttendanceSchema.parse({
    type: data.type,
    reason: data.reason,
    ...(data.time_submitted && { time_submitted: data.time_submitted }),
    ...(data.arrive_time && { arrive_time: data.arrive_time }),
    ...(data.leave_time && { leave_time: data.leave_time }),
    member_id: data.member_id,
    event_id: data.member_id,
  });

  return typedAttendance as Attendance;
};

//AttendanceRecord
export const AttendanceRecordSchema = z
  .object({
    person_id: z.string(),
    event_id: z.string(),
    attendance_status: z.string(),
  })
  .strict();

export type AttendanceRecord = z.infer<typeof AttendanceRecordSchema>;
