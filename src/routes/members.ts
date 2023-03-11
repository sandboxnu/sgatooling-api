import express from "express";
import {getAllMembers, getSpecificGroup, getMember, createMember} from "../database.js"
import Joi from "joi";

const membersRouter = express.Router();

membersRouter.get("/", async (req, res) => {
    //check to make sure that we have actual value within our struct
    //also very fun, errors in sql completely crash the api so yeah need to try catch those
    let members
    //just copied this off stack exchange...
    const isEmpty = (obj) => {
        for (var x in obj) {return false}
        return true
    }
    
    if(isEmpty(req.query)) {
        members = await getAllMembers()
    } else {
        members = await getSpecificGroup(req.query)
    }

    res.send(members);
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
        receive_email_notifs: Joi.boolean().required(),
        include_in_quorum: Joi.boolean().required(),
        receive_not_present_email: Joi.boolean().required(),
        can_log_in: Joi.boolean().required(),
    })

    const result = schema.validate(req.body);
    if(result.error) {
        res.status(405).send(result.error.details[0].message)
        return;
    }

    //idk why but theres some bugs with this createMember Route where although the fields come in as a boolean, the values in the database are null,

    const newMember = await createMember(req.body)
    res.send(newMember)
});


membersRouter.get("/:id", async (req, res) => {
    const member = await getMember(req.params.id);
    res.send(member)
});

export {membersRouter};