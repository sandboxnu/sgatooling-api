import { VercelRequest, VercelResponse } from "@vercel/node";
import MembersController from "../../src/controllers/memberController";
import { z } from "zod";
import { allowCors } from "../middleware";

const membersController = new MembersController();

const getMember = async function (req: VercelRequest, res: VercelResponse) {
  try {
    const member = await membersController.getMember(req.query.id as string);
    res.status(200).json(member);
  } catch (error: unknown) {
    error instanceof z.ZodError
      ? res.status(404).send("Member not found")
      : res.status(500).send("Database Error");
  }
};

export default allowCors(getMember);
