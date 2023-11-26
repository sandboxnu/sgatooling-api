import { VercelRequest, VercelResponse } from '@vercel/node';
import MembersController from "../../src/controllers/memberController";

const membersController = new MembersController();

export default async function (req: VercelRequest, res: VercelResponse) {
  try {
    const member = await membersController.getMember(req.query.id as string);
    if (!member) {
      res.status(404).send("Member Not Found");
      return;
    }
    res.status(200).json({member: member});
  } catch (error: unknown) {
    res.status(500).send("Database Error");
  }
}
