import { VercelRequest, VercelResponse } from "@vercel/node";
import MembersController from "../../src/controllers/memberController";
import { allowCors } from "../middleware";

const membersController = new MembersController();

const getMemberTags = async function (req: VercelRequest, res: VercelResponse) {
  try {
    const memberTags = await membersController.getMemberTags(
      req.query.id as string
    );
    res.status(200).json({ memberTags: memberTags });
  } catch (error: unknown) {
    res.status(500).send("Database Error");
  }
};

export default allowCors(getMemberTags);
