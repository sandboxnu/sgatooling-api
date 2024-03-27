import { VotingController } from "../../src/controllers/votingController";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { VotingHistorySchema } from "../../src/types/types";
import { ZodError } from "zod";
import allowCors from "../middleware";

// for a post request can parse the body using the schema -> goes into where it needs to
const voteHistoryController = new VotingController();

const postAttendanceChange = async (
  req: VercelRequest,
  res: VercelResponse
) => {
  try {
    const result = VotingHistorySchema.parse(req.body);
    // TOOD
    const vote = await voteHistoryController.createVote();
    res.status(201).json({ vote });
  } catch (error) {
    error instanceof ZodError
      ? res.status(400).send("Invalid Input")
      : res.status(500).send("Database Error");
  }
};

export default allowCors(postAttendanceChange);
