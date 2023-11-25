import { VercelRequest, VercelResponse } from '@vercel/node';
import MembersController from "../../src/controllers/memberController";

const membersController = new MembersController();

export default async function (req: VercelRequest, res: VercelResponse) {
  try {
    const memberTags = await membersController.getMemberTags(req.query.id as string);
    res.status(200).send(memberTags);
  } catch (error: unknown) {
    res.status(500).send("Database Error");
  }
}
