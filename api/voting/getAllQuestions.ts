import { VotingController } from "../../src/controllers/votingController";
import allowCors from "../middleware";
import { VercelRequest, VercelResponse } from "@vercel/node";

const votingController = new VotingController();

const getAllQuestions = async (req: VercelRequest, res: VercelResponse) => {
  try {
    const votingQuestions = await votingController.getAllQuestions();
    res.status(200).json(votingQuestions);
  } catch (err: unknown) {
    res.status(500).send("Database Error");
  }
};

export default allowCors(getAllQuestions);
