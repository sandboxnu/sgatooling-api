import express from "express";
import MembersController from "../controllers/members.js";
import Joi from "joi";

const membersRouter = express.Router();

const membersController = new MembersController();

//method for determining whether an incoming json is empty
export const isEmpty = (obj) => {
  for (var x in obj) {
    return false;
  }
  return true;
};

membersRouter.get("/", async (req, res) => {
  //initial queries that are not supported -> 500 error
  let members;
  try {
    if (isEmpty(req.query)) {
      members = await membersController.getAllMembers();
    } else {
      members = await membersController.getSpecificGroup(req.query);
    }
    if (!members) {
      //can't do res.send twice so must exit the route
      res.status(404).send("Member Not Found");
      return;
    }
    res.send(members);
  } catch (error: unknown) {
    res.status(500).send("Database Error");
  }
});

membersRouter.post("/", async (req, res) => {
  //schema to enforce the types that we need and the requirements that we need
  const schema = Joi.object({
    nuid: Joi.string().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().required(),
    active: Joi.boolean().required(),
    can_vote: Joi.boolean().required(),
    include_in_quorum: Joi.boolean().required(),
    receive_not_present_email: Joi.boolean().required(),
    can_log_in: Joi.boolean().required(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    res.status(405).send("Invalid Input");
  } else {
    const newMember = await membersController.createMember(req.body);
    res.send(newMember);
  }
});

membersRouter.get("/:id", async (req, res) => {
  const member = await membersController.getMember(req.params.id);
  if (!member) {
    res.status(404).send("Member Not Found");
    return;
  }
  res.send(member);
});

export { membersRouter };
