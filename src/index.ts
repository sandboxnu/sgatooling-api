import express, {Express, Request, Response} from "express";
import localDb from "./local_db.js"
import { Member } from "./types/member.js";
const PORT = 8080;
const app = express();

app.use(express.json())

app.get("/members", (req, res) => {
    console.log(req.query);


    function filtersearches() {
        const list = localDb["Members"];
        let copy = list;

        //should group come in as in index or as a string?
        if(req.query.hasOwnProperty("group")) {
            const groups = localDb["Group"]
            //this returns a list with filter, so maybe map?
            const group = groups.filter( element => element.group_name == req.query.group)
            console.log(group)

            const Membership = localDb["Membership"]

            //TODO: make this a filter
            //const memberids = Membership.filter(membership => membership.group_id == group[0].id)
            //console.log(memberids)
            //this just brings me back a list of items which is not entirely what I want, i just want the index
            const memberids = []
            
            for (const index in localDb["Membership"]) {
                //console.log(index)
                if(Membership[index]["group_id"] == group[0]["id"]) {
                    memberids.push(Membership[index]["membership_id"])
                }
            }
            
            copy = localDb["Members"].filter( member => memberids.includes(member.id))
            console.log(copy)

        }

        if(req.query.hasOwnProperty("active")) {
            const found = copy.filter(members => members["active"] == true)
            if(found.length != 0) {
                copy = found;
            } else {
                res.status(404).json("Member Not Found");
                return;
            }
        }


        //make this a member type:
        if(req.query.hasOwnProperty("include-in-quorum")) {
            const found = copy.filter(members => members["include_in_quorum"] == true)
            if(found.length != 0) {
                copy = found;
            }else {
                res.status(404).json("Member not found")
                return;
            }
        }

        return copy;
    }

    const members = filtersearches()
    res.send(members);
});

app.post("/members", (req, res) => {

    //TODO some validation checking
    const newMember: Member = {
        id: localDb["Members"].length + 1,
        nuid: req.body.nuid,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        active: req.body.active,
        can_vote: req.body.voting_rights,
        receive_email_notifs: req.body.recieve_email_notifs,
        include_in_quorum: req.body.include_in_quorum,
        receive_not_present_email: req.body.receive_not_present_email,
        can_log_in: req.body.sign_in_blocked,
    }

    localDb["Members"].push(newMember)
    res.send(newMember)
});


app.get("/members/:id", (req, res) => {
    //is it always assumed that data will be in order of id number?
    const member = localDb["Members"][parseInt(req.params.id) - 1]
    res.send(member)
})


app.listen(PORT, () => console.log(`Local Host is running on PORT: ${PORT}`))