import dotenv from "dotenv";
dotenv.config();
import * as mysql2 from "mysql2";
export const pool = mysql2
    .createPool({
    host: process.env.DB_HOST,
    //port: process.env.MYSQL_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
})
    .promise();
class MembersController {
    async getAllMembers() {
        const [result] = await pool.query("SELECT uuid, first_name, last_name, email, active_member, voting_rights, include_in_quorum, receive_not_present_email, sign_in_blocked FROM Member");
        const members = Object.keys(result).map((elem) => {
            return {
                id: 0,
                nuid: result[elem].uuid,
                first_name: result[elem].first_name,
                last_name: result[elem].last_name,
                email: result[elem].email,
                active: result[elem].active,
                can_vote: result[elem].can_vote,
                receive_email_notifs: true,
                include_in_quorum: result[elem].include_in_quorum,
                receive_not_present_email: result[elem].receive_not_present_email,
                can_log_in: result[elem].can_log_in,
            };
        });
        console.log(members);
        return result;
    }
    async getSpecificGroup(urlArgs) {
        let initialString = `SELECT uuid, first_name, last_name, email, active_member, voting_rights, include_in_quorum, receive_not_present_email, sign_in_blocked
        FROM Member JOIN MemberGroup M on Member.uuid = M.person_id `;
        let data;
        let result;
        let keys = Object.keys(urlArgs);
        let queryString = "WHERE ";
        for (let index = 0; index < keys.length; index++) {
            if (index >= 1) {
                queryString += " AND ";
            }
            let item = keys[index];
            if (item === "group") {
                queryString += "membership_group = ?";
                data = [urlArgs[item]];
            }
            if (item === "active") {
                queryString += "active_member";
            }
            if (item === "include-in-quorum") {
                queryString += "include_in_quorum";
            }
        }
        let totalString = initialString + queryString;
        //meaning that we supply a value for groupname
        if (data) {
            [result] = await pool.query(totalString, data);
        }
        else {
            [result] = await pool.query(totalString);
        }
        if (Object.keys(result).length === 0) {
            return null;
        }
        return result;
    }
    async createMember(bodyData) {
        const [result] = await pool.query(`
    INSERT INTO Member (uuid, first_name, last_name, email, active_member, voting_rights, include_in_quorum, receive_not_present_email, sign_in_blocked)
    VALUES (?, ?, ?, ?, ? , ?, ?, ?, ?)`, [
            bodyData.nuid,
            bodyData.first_name,
            bodyData.last_name,
            bodyData.email,
            bodyData.active,
            bodyData.can_vote,
            bodyData.include_in_quorum,
            bodyData.receive_not_present_email,
            bodyData.can_log_in,
        ]);
        //this is a big buggy not sure if its a post issue on my end
        //const id = result["insertId"];
        //const member = await this.getMember(id);
        const member = await pool.query(`SELECT * FROM Member WHERE uuid = ?`, [
            bodyData.nuid,
        ]);
        return member;
    }
    async getMember(id) {
        const [memberInfo] = await pool.query(`SELECT * FROM Member WHERE uuid = ?`, [id]);
        if (Object.keys(memberInfo).length === 0) {
            return null;
        }
        return memberInfo;
    }
}
export default MembersController;
//# sourceMappingURL=members.js.map