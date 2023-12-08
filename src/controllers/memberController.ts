import { RowDataPacket } from "mysql2";
import { ZodError } from "zod";
import {
  Member,
  MemberSchema,
  MQueryType,
  MemberGroupSchema,
  MemberGroupType,
} from "../types/types";
import { parseDataToMemberType } from "../types/types";
import { isEmpty, pool, createdRandomUID } from "../utils";

class MembersController {
  async getAllMembers() {
    const [data] = await pool.query("SELECT * FROM Member");
    const parsedData = data as RowDataPacket[];

    const Members = parsedData
      .map((member) => {
        try {
          const parsedMember = parseDataToMemberType(member);
          return parsedMember;
        } catch (err) {
          return null;
        }
      })
      .filter(Boolean);

    return Members;
  }

  async getSpecificGroup(urlArgs: MQueryType) {
    let SELECTFROM =
      "SELECT Member.id, nuid, first_name, last_name, email, active_member, can_vote, receive_email_notifs, include_in_quorum, can_log_in FROM Member ";
    let JOIN = "";
    let WHERE = "WHERE ";

    let data;
    const validParams = new Map([
      ["group", "MembershipGroup.group_name = ?"],
      ["active", "active_member"],
      ["include-in-quorum", "include_in_quorum"],
    ]);

    for (let index = 0; index < Object.keys(urlArgs).length; index++) {
      const item = Object.keys(urlArgs)[index];

      if (index >= 1) {
        WHERE += " AND ";
      }

      if (item === "group") {
        //including this join separately because maybe its not assumed a member is in a group
        JOIN +=
          "JOIN Membership ON Member.id = Membership.membership_id JOIN MembershipGroup ON Membership.group_id = MembershipGroup.id ";
        data = [urlArgs[item]];
      }
      WHERE += validParams.get(item);
    }

    let totalString = SELECTFROM + JOIN + WHERE;

    const [result] = await pool.query(totalString, data);
    if (isEmpty(result)) return null;

    const members = result as RowDataPacket[];
    const parsedMembers = members
      .map((member) => {
        try {
          const Member = parseDataToMemberType(member);
          return Member;
        } catch (err) {
          return null;
        }
      })
      .filter(Boolean);

    return parsedMembers;
  }

  async createMember(bodyData: Member) {
    const randomuuid = createdRandomUID();
    const keys = Object.keys(bodyData);
    const values = Object.values(bodyData);

    let initialQuery = "INSERT INTO Member (id, ";
    let initialValue = " Values (?,";

    for (let index = 0; index < keys.length; index++) {
      const item = keys[index];
      //unless we are at the last index:
      if (index !== keys.length - 1) {
        initialQuery += item + ", ";
        initialValue += "?, ";
      } else {
        initialQuery += item + ")";
        initialValue += "?)";
      }
    }

    const totalString = initialQuery + initialValue;
    const newValues = [randomuuid, ...values];
    //initial query to insert the item in the db
    const [result] = await pool.query(totalString, newValues);

    //subsequent query to get the information of the item we just inserted
    const Member = this.getMember(randomuuid);

    return Member;
  }

  async getMember(id: string) {
    const [data] = await pool.query(`SELECT * FROM Member WHERE uuid = ?`, [
      id,
    ]);

    const memberInfo = (data as RowDataPacket[])[0];

    const Member = parseDataToMemberType(memberInfo);
    return Member;
  }

  async getMemberTags(id: string) {
    const [data] = await pool.query(
      `SELECT * FROM MemberGroup WHERE person_id = ?`,
      [id]
    );

    const castedValue = data as RowDataPacket[];
    const Tags = castedValue
      .map((element) => {
        try {
          const castedMemberValue = MemberGroupSchema.parse({
            person_id: element.person_id,
            membership_group: element.membership_group,
          });
          return castedMemberValue as MemberGroupType;
        } catch (err) {
          return null;
        }
      })
      .filter(Boolean);

    return Tags;
  }

  async updateMemberPreferences(id: string) {
    await pool.query(
      `UPDATE Member SET receive_not_present_email = NOT receive_not_present_email WHERE uuid = ?`,
      [id]
    );

    return this.getMember(id);
  }
}

export default MembersController;
