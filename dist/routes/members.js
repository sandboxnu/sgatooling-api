import express from "express";
import MembersController from "../controllers/members.js";
import { getMembers } from "../database.js";
import Joi from "joi";
const membersRouter = express.Router();
const membersControllers = new MembersController();
membersRouter.get("/", (req, res) => {
    //error handling for when we have some random inputs coming in
    //honestly not sure how to make an easy way to do this...
    console.log(req.query);
    const members = getMembers(req.query);
    console.log(members);
    /*

    let members = membersControllers.getAllMembers();

    if(req.query.hasOwnProperty("group")) {
        try {
            const group = req.query.group as string;
            members = membersControllers.getGroupMembers(group, members)
        } catch(error) {
            //do something later
        }
    }

    if(req.query.hasOwnProperty("active")) {
        try {
            members = membersControllers.getActiveMembers(members);
        } catch(error) {
            //do something later
        }
    }

    if(req.query.hasOwnProperty("include-in-quorum")) {
        try {
            console.log("made it here")
            members = membersControllers.getQuorumMembers(members);
        } catch(error ) {
            //do something later
        }
    }
    */
    res.send(members);
});
membersRouter.post("/", (req, res) => {
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
    });
    const result = schema.validate(req.body);
    if (result.error) {
        res.status(405).send("Invalid Input");
        return;
    }
    const newMember = membersControllers.createMember(req.body);
    res.send(newMember);
});
membersRouter.get("/:id", (req, res) => {
    try {
        const member = membersControllers.getMember(parseInt(req.params.id));
        res.send(member);
    }
    catch (error) {
        //throw an error and bad status code
    }
});
export { membersRouter };
//# sourceMappingURL=members.js.map