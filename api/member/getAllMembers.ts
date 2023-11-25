import { VercelRequest, VercelResponse } from '@vercel/node';
import { isEmpty } from "../../src/utils";
import MembersController from "../../src/controllers/memberController";
import { MemberQuery } from "../../src/types/types";
import { z } from "zod";

const membersController = new MembersController();

export default async (req: VercelRequest, res: VercelResponse) => {
  let members;
  try {
    if (isEmpty(req.query)) {
      members = await membersController.getAllMembers();
    } else {
      //else we validate that its one of/multiple of the supported enums
      const result = MemberQuery.parse(req.query);
      members = await membersController.getSpecificGroup(result);
    }
    //if no members found return a 404 else, send back the members
    !members
      ? res.status(404).send("Member Not Found")
      : res.status(200).send(members);
  } catch (error: unknown) {
    error instanceof z.ZodError
      ? res.status(405).send("Invalid Query Parameters")
      : res.status(500).send("Database Error");
  }
};
