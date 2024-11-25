import { VercelRequest, VercelResponse } from "@vercel/node";
import { MemberController } from "../../src/controllers/memberController";
import { allowCors } from "../middleware";
import { PrismaMemberController } from "../../src/controllers/prismaMemberController";

const membersController = new MemberController();

const updateMemberPreferences = async function (
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const member = await membersController.updateMemberPreferences(
      req.query.id as string
    );
    res.status(201).json({ member: member });
  } catch (error: unknown) {
    res.status(500).send("Database Error");
  }
};

export default allowCors(updateMemberPreferences);
