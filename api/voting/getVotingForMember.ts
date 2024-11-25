import { allowCors } from "../middleware";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { VotingController } from "../../src/controllers/votingController";
import { ZodError } from "zod";
import { parseVoteQuery } from "../../src/types/voting";
import { PrismaVotingController } from "../../src/controllers/prismaVotingController";

const votingController = new PrismaVotingController();

const getVotingForMember = async (req: VercelRequest, res: VercelResponse) => {
  try {
    const result = parseVoteQuery(req.query);
    const potentialVote = await votingController.getVotingHistory(result);
    res.status(200).json(potentialVote);
  } catch (error: unknown) {
    error instanceof ZodError
      ? res.status(400).send("Invalid Input")
      : res.status(500).send("Database error");
  }
};

export default allowCors(getVotingForMember);
