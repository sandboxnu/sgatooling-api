import { z } from "zod";
import { castBufferToBoolean } from "../utils";
import { Member as PrismaMember } from "@prisma/client";

const MemberSchema = z
  .object({
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
  .strict();

const MemberGroupSchema = z.object({
  person_id: z.string(),
  membership_group: z.string(),
});

const GetMembersParams = z
  .object({
    group: z.string().optional(),
    active: z.string().optional(),
    includeInQuorum: z.string().optional(),
  })
  .strict();

export const parseMemberType = (body: any) => {
  const parsedMember = MemberSchema.parse(body);

  return parsedMember as Member;
};

export const parseGetMemberParams = (body: any) => {
  const parsedParams = GetMembersParams.parse(body);

  return parsedParams as GetMembersParamsType;
};

export const parseDataToMemberType = (data: PrismaMember) => {
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

export type Member = z.infer<typeof MemberSchema>;
export type MemberGroupType = z.infer<typeof MemberGroupSchema>;
export type GetMembersParamsType = z.infer<typeof GetMembersParams>;
