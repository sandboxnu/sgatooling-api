import { VercelRequest, VercelResponse } from "@vercel/node";
import { VotingController } from "../../src/controllers/votingController";
import { ZodError } from "zod";
import allowCors from "../middleware";

const votingController = new VotingController();

const getPastVotes = async (req: VercelRequest, res: VercelResponse) => {
  try {
    const pastVotes = await votingController.getMembersPastVotes(
      req.query.id as string
    );
    res.status(200).json(pastVotes);
  } catch (error: unknown) {
    error instanceof ZodError
      ? res.status(400).send("Invalid Input")
      : res.status(500).send("Database error");
  }
};

export default allowCors(getPastVotes);
