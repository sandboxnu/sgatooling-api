import express from "express";
import dotenv from 'dotenv';
import mysql from 'mysql';
dotenv.config();
// dotenv.config({path:'../.env'})
const PORT = 8080;
const app = express();
// const mysql = require('mysql');
console.log(process.env.DB_HOST);
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});
connection.connect(function (err) {
    console.log("trying to connect");
    if (err)
        throw err;
    console.log("Connected!");
});
connection.query('SELECT', (err, rows, fields) => {
    if (err)
        throw err;
    console.log('The solution is: ', rows[0].solution);
});
/*

app.use(express.json())

app.get("/members", (req, res) => {
    console.log(req.query);

    //in the try check what the query is, and if its not what we expect return an error:

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
            const found = copy.filter(members => members["active"] === true)
            if(found.length != 0) {
                copy = found;
            } else {
                res.status(404).json("Member Not Found");
                return;
            }
        }


        //make this a member type:
        if(req.query.hasOwnProperty("include-in-quorum")) {
            const found = copy.filter(members => members["include_in_quorum"] === true)
            if(found.length != 0) {
                copy = found;
            }else {
                res.status(404).json("Member not found")
                return;
            }
        }

        //currently if the string is malformed/bad request it still gets all of them
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
    //dont' have to assume that the code is sorted
    const member = localDb["Members"][parseInt(req.params.id)]
    res.send(member)
})


app.listen(PORT, () => console.log(`Local Host is running on PORT: ${PORT}`))

*/
connection.end();
//# sourceMappingURL=index.js.map