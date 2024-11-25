import { VercelRequest, VercelResponse } from "@vercel/node";
import { isEmpty } from "../../src/utils";
import { z } from "zod";
import { parseGetMemberParams } from "../../src/types/member";
import { MemberController } from "../../src/controllers/memberController";

const membersController = new MemberController();

export default async (req: VercelRequest, res: VercelResponse) => {
  let members;
  try {
    if (isEmpty(req.query)) {
      members = await membersController.getAllMembers();
    } else {
      //else we validate that its one of/multiple of the supported enums
      const result = parseGetMemberParams(req.query);
      members = await membersController.getSpecificGroup(result);
    }
    //if no members found return a 404 else, send back the members
    !members
      ? res.status(404).send("Member Not Found")
      : res.status(200).json({ members: members });
  } catch (error: unknown) {
    error instanceof z.ZodError
      ? res.status(400).send("Invalid Query Parameters")
      : res.status(500).send("Database Error");
  }
};
