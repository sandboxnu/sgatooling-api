import dotenv from "dotenv";
dotenv.config();
import * as mysql2 from "mysql2";
//import { Member } from "../types/member.js";
import { isEmpty } from "../routes/memberRoutes.js";

export const pool = mysql2
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  })
  .promise();

class MembersController {
  async getAllMembers() {
    const [result] = await pool.query(
      "SELECT uuid, first_name, last_name, email, active_member, voting_rights, include_in_quorum, receive_not_present_email, sign_in_blocked FROM Member"
    );
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
    } else {
      [result] = await pool.query(totalString);
    }

    return isEmpty(result) ? null : result;
  }

  async createMember(bodyData) {
    const [result] = await pool.query(
      `
    INSERT INTO Member (uuid, first_name, last_name, email, active_member, voting_rights, include_in_quorum, receive_not_present_email, sign_in_blocked)
    VALUES (?, ?, ?, ?, ? , ?, ?, ?, ?) `,
      [
        bodyData.nuid,
        bodyData.first_name,
        bodyData.last_name,
        bodyData.email,
        bodyData.active,
        bodyData.can_vote,
        bodyData.include_in_quorum,
        bodyData.receive_not_present_email,
        bodyData.can_log_in,
      ]
    );

    console.log(result);

    const member = await pool.query(`SELECT * FROM Member WHERE uuid = ?`, [
      bodyData.nuid,
    ]);

    return member;
  }

  async getMember(id: string) {
    const [memberInfo] = await pool.query(
      `SELECT * FROM Member WHERE uuid = ?`,
      [id]
    );
    return isEmpty(memberInfo) ? null : memberInfo;
  }
}

export default MembersController;
