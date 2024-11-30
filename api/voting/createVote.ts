import { VotingController } from "../../src/controllers/votingController";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { ZodError } from "zod";
import { allowCors } from "../middleware";
import { parseVote } from "../../src/types/voting";

const voteHistoryController = new VotingController();

const postAttendanceChange = async (
  req: VercelRequest,
  res: VercelResponse
) => {
  try {
    const parsed = parseVote(req.body);
    const vote = await voteHistoryController.createVote(parsed);
    res.status(201).json({ vote });
  } catch (error) {
    error instanceof ZodError
      ? res.status(400).send("Invalid Input")
      : res.status(500).send("Database Error");
  }
};

export default allowCors(postAttendanceChange);
