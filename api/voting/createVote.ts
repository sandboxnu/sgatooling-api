import { VotingController } from "../../src/controllers/votingController";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { VotingHistorySchema } from "../../src/types/types";
import { ZodError } from "zod";
import allowCors from "../middleware";

const voteHistoryController = new VotingController();

const postVote = async (req: VercelRequest, res: VercelResponse) => {
  try {
    const parsed = VotingHistorySchema.parse(req.body);
    const vote = await voteHistoryController.createVote(parsed);
    res.status(201).json({ vote });
  } catch (error) {
    error instanceof ZodError
      ? res.status(400).send("Invalid Input")
      : res.status(500).send("Database Error");
  }
};

export default allowCors(postVote);
