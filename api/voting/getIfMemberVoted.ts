import { VercelRequest, VercelResponse } from "@vercel/node";
import { VotingController } from "../../src/controllers/votingController";
import { ZodError } from "zod";
import allowCors from "../middleware";

const votingController = new VotingController();

const getIfMemberVoted = async (req: VercelRequest, res: VercelResponse) => {
  try {
    const potentialQuestion = await votingController.determineQuestion(
      req.query.id as string
    );
    res.status(200).json(potentialQuestion);
  } catch (error: unknown) {
    error instanceof ZodError
      ? res.status(400).send("Invalid Input")
      : res.status(500).send("Database error");
  }
};

export default allowCors(getIfMemberVoted);
