import { VercelRequest, VercelResponse } from "@vercel/node";
import MembersController from "../../src/controllers/memberController";
import { parseMemberType } from "../../src/types/member";
import { z } from "zod";

const membersController = new MembersController();

export default async function (req: VercelRequest, res: VercelResponse) {
  try {
    //try to parse the result
    const result = parseMemberType(req.body);
    const newMember = await membersController.createMember(result);
    res.status(201).json({ member: newMember });
  } catch (err) {
    if (err instanceof z.ZodError) {
      //means we have bad inputs
      res.status(400).send("Invalid Data");
    } else {
      //some database error when creating the new member
      res.status(500).send("Database Error");
    }
  }
}
