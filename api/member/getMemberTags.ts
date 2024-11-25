import { VercelRequest, VercelResponse } from "@vercel/node";
import { MemberController } from "../../src/controllers/memberController";
import { allowCors } from "../middleware";
import { PrismaMemberController } from "../../src/controllers/prismaMemberController";

const membersController = new MemberController();

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
