import { isEmpty, pool, createdRandomUID } from "../utils.js";

class MembersController {
  async getAllMembers() {
    //Note: can't use select * in here otherwise the encodings flood the entire screen
    const [result] = await pool.query(
      "SELECT id, nuid, first_name, last_name, email, active_member, can_vote, receive_email_notifs, include_in_quorum, can_log_in FROM Member"
    );
    return result;
  }

  async getSpecificGroup(urlArgs) {
    //because we join with MemberGroup ad more we need to list the parameters we need from the Member Table
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
      if (!validParams.has(item)) {
        throw new Error("unsupported Key");
      }

      if (index >= 1) {
        WHERE += " AND ";
      }

      if (validParams.has(item)) {
        if (item === "group") {
          //very fun join statements :)
          //including this join separately because maybe its not assumed a member is in a group
          JOIN +=
            "JOIN Membership ON Member.id = Membership.membership_id JOIN MembershipGroup ON Membership.group_id = MembershipGroup.id ";
          data = [urlArgs[item]];
        }
        WHERE += validParams.get(item);
      }
    }

    let totalString = SELECTFROM + JOIN + WHERE;
    console.log(totalString);

    const [result] = await pool.query(totalString, data);

    return isEmpty(result) ? null : result;
  }

  async createMember(bodyData) {
    const randomuuid = createdRandomUID();
    let initialQuery = "INSERT INTO Member (id, ";
    let initialValue = " Values (?,";

    const keys = Object.keys(bodyData);
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
    console.log(totalString);
    const newValues = [randomuuid].concat(Object.values(bodyData));
    //initial query to insert the item in the db
    const [result] = await pool.query(totalString, newValues);

    //subsequent query to get the information of the item we just inserted
    const [Member] = await pool.query("SELECT * FROM Member WHERE id = ?", [
      randomuuid,
    ]);

    return Member;
  }

  async getMember(id: string) {
    const [memberInfo] = await pool.query(`SELECT * FROM Member WHERE id = ?`, [
      id,
    ]);
    return isEmpty(memberInfo) ? null : memberInfo;
  }
}

export default MembersController;
