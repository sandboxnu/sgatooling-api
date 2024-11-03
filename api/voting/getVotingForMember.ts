import { allowCors } from "../middleware";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { VotingController } from "../../src/controllers/votingController";
import { ZodError } from "zod";
import { VoteHistoryQuerySchema } from "../../src/types/types";

const votingController = new VotingController();

const getVotingForMember = async (req: VercelRequest, res: VercelResponse) => {
  try {
    const result = VoteHistoryQuerySchema.parse(req.query);
    const potentialVote = await votingController.getVotingHistory(result);
    res.status(200).json(potentialVote);
  } catch (error: unknown) {
    error instanceof ZodError
      ? res.status(400).send("Invalid Input")
      : res.status(500).send("Database error");
  }
};

export default allowCors(getVotingForMember);
