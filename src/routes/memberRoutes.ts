import express from "express";
import { z } from "zod";
import { isEmpty } from "../utils";
import MembersController from "../controllers/memberController";
import { MemberSchema, MemberQuery } from "../types/types";

const membersRouter = express.Router();
const membersController = new MembersController();

membersRouter.get("/", async (req, res) => {
  //initial queries that are not supported -> 500 error
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
      ? res.status(404).send("Invalid Query Parameters")
      : res.status(500).send("Database Error");
  }
});

membersRouter.post("/", async (req, res) => {
  try {
    //try to parse the result
    const result = MemberSchema.parse(req.body);
    const newMember = await membersController.createMember(result);
    res.status(200).send(newMember);
  } catch (err) {
    if (err instanceof z.ZodError) {
      //means we have bad inputs
      res.status(404).send("Invalid Data");
    } else {
      //some database error when creating the new member
      res.status(500).send("Database Error");
    }
  }
});

membersRouter.get("/:id", async (req, res) => {
  try {
    const member = await membersController.getMember(req.params.id);
    if (!member) {
      res.status(404).send("Member Not Found");
      return;
    }
    res.status(200).send(member);
  } catch (error: unknown) {
    res.status(500).send("Database Error");
  }
});

export { membersRouter };
