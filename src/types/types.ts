//Types and Schemas for the database
import { z } from "zod";
import { RowDataPacket } from "mysql2";
import { castBufferToBoolean } from "../utils";
import { string } from "joi";

//Member
export const MemberSchema = z
  .object({
    //uuid still remains, and now we add in nuid field
    id: z.string(),
    nuid: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    activeMember: z.boolean(),
    votingRights: z.boolean(),
    includeInQuorum: z.boolean(),
    receiveNotPresentEmail: z.boolean(),
    signInBlocked: z.boolean(),
  })
  //strict makes sure that these are the only valid parameters, and nothing else gets included that's rubbish
  .strict();

export type Member = z.infer<typeof MemberSchema>;

export const parseDataToMemberType = (data: RowDataPacket) => {
  const parsedMember = MemberSchema.parse({
    id: data.uuid,
    nuid: data.nuid,
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    activeMember: castBufferToBoolean(data.active_member),
    votingRights: castBufferToBoolean(data.voting_rights),
    includeInQuorum: castBufferToBoolean(data.include_in_quorum),
    receiveNotPresentEmail: castBufferToBoolean(data.receive_not_present_email),
    signInBlocked: castBufferToBoolean(data.sign_in_blocked),
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
    id: z.string(),
    eventName: z.string(),
    startTime: z.date().optional(),
    endTime: z.date().optional(),
    signInClosed: z.boolean(),
    description: z.string(),
    location: z.string(),
    membershipGroup: z
      .array(z.enum(["New Senators Fall 2022", "All active"]))
      .optional(),
  })
  .strict();

export type Event = z.infer<typeof EventSchema>;

export const parseDataToEventType = (data: RowDataPacket) => {
  const splitMembership = data.membership_group.split(",");
  const typedEvent = EventSchema.parse({
    id: data.uuid,
    eventName: data.event_name,
    ...(data.start_time && { startTime: new Date(data.start_time) }),
    ...(data.end_time && { endTime: new Date(data.end_time) }),
    signInClosed: !!data.sign_in_closed,
    description: data.description,
    location: data.location,
    membershipGroup: splitMembership,
  });
  return typedEvent as Event;
};

//Attendance
//datetime type may be incorrect/annoying can change later
export const AttendanceReqSchema = z.object({
  type: z.enum(["absent", "arriving late", "leaving early"]),
  reason: z.string(),
  time_submitted: z.string(),
  time_arriving: z.string().optional(),
  time_leaving: z.string().optional(),
  member_id: z.string(),
  event_id: z.string(),
});

// uuid, change_status,
export const AttendanceQuery = z
  .object({
    limit: z.string().optional(),
    memberID: z.string().optional(),
    eventID: z.string().optional(),
  })
  .strict();

export type AQueryType = z.infer<typeof AttendanceQuery>;

export type AttendanceS = z.infer<typeof AttendanceReqSchema>;

export const AttendanceSchema = AttendanceReqSchema.extend({
  uuid: z.string(),
  change_status: z.string(),
});

export type Attendance = z.infer<typeof AttendanceSchema>;

export const parseDataToAttendanceType = (data: RowDataPacket) => {
  const typedAttendance = AttendanceSchema.parse({
    uuid: data.uuid,
    type: data.type,
    reason: data.reason,
    change_status: data.change_status,
    ...(data.time_submitted && { time_submitted: data.time_submitted }),
    ...(data.time_arriving && { time_arriving: data.time_arriving }),
    ...(data.time_leaving && { time_leaving: data.time_leaving }),
    member_id: data.member_id,
    event_id: data.event_id,
  });

  return typedAttendance as Attendance;
};

//AttendanceRecord
export const AttendanceRecordSchema = z
  .object({
    memberId: z.string(),
    attendanceStatus: z.string(),
    event: EventSchema,
  })
  .strict();

export type AttendanceRecord = z.infer<typeof AttendanceRecordSchema>;

export const TagSchema = z.object({
  membership_group: z.string(),
});

export type Tags = z.infer<typeof TagSchema>;

//Voting Types:
export const VotingHistorySchema = z
  .object({
    member_id: z.string(),
    vote_id: z.string(),
    vote_selection: z.enum(["A", "Y", "N"]),
  })
  .strict();

export const VotingQuestionSchema = z
  .object({
    uuid: z.string(),
    question: z.string(),
    description: z.string().optional(),
    time_start: z.date(),
    time_end: z.date(),
  })
  .strict();

export type VotingHistory = z.infer<typeof VotingHistorySchema>;

export type VotingQuestion = z.infer<typeof VotingQuestionSchema>;

export const parseDataToVoteQuestion = (data: RowDataPacket) => {
  const typedQuestion = VotingQuestionSchema.parse({
    uuid: data.uuid,
    question: data.question,
    ...(data.description && { description: data.description }),
    time_start: new Date(data.time_start),
    time_end: new Date(data.time_end),
  });

  return typedQuestion as VotingQuestion;
};
