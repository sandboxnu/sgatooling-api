import { RowDataPacket } from "mysql2";
import { z } from "zod";

const VoteSchema = z
  .object({
    member_id: z.string(),
    vote_id: z.string(),
    vote_selection: z.enum(["A", "Y", "N"]),
  })
  .strict();

const VotingQuestionSchema = z
  .object({
    uuid: z.string(),
    question: z.string(),
    description: z.string().optional(),
    time_start: z.string(),
    time_end: z.string(),
  })
  .strict();

const VoteQuerySchema = z
  .object({
    member_id: z.string(),
    vote_id: z.string().optional(),
  })
  .strict();

export const parseDataToVote = (data: RowDataPacket) => {
  const typedVote = VoteSchema.parse({
    member_id: data.member_id,
    vote_id: data.vote_id,
    vote_selection: data.vote_selection,
  });

  return typedVote as VoteType;
};

export const parseDataToVotingQuestion = (data: RowDataPacket) => {
  const typedQuestion = VotingQuestionSchema.parse({
    uuid: data.uuid,
    question: data.question,
    ...(data.description && { description: data.description }),
    time_start: data.time_start,
    time_end: data.time_end,
  });

  return typedQuestion as VotingQuestionType;
};

export const parseVote = (body: any) => {
  const parsedVote = VoteSchema.parse(body);

  return parsedVote as VoteType;
};

export const parseVoteQuery = (body: any) => {
  const parsedVoteQuery = VoteQuerySchema.parse(body);

  return parsedVoteQuery as VoteQueryType;
};

export type VoteType = z.infer<typeof VoteSchema>;
export type VotingQuestionType = z.infer<typeof VotingQuestionSchema>;
export type VoteQueryType = z.infer<typeof VoteQuerySchema>;
