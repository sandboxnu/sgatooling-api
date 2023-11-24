import { isEmpty, pool } from "../utils";
import { Member, MemberSchema } from "../types/types";
import { z } from "zod";


class AuthController {
  async getMember(id: string): Promise<Member | Error> {
    const [memberInfo] = await pool.query(
      `SELECT * FROM Member WHERE uuid = ?`,
      [id]
    );
    
    try {
      console.log(memberInfo)
      const typedUser = MemberSchema.parse({
        uuid: memberInfo.uuid, 
        first_name: memberInfo.first_name, 
        last_name: memberInfo.last_name, 
        email: memberInfo.email, 
        active_member: memberInfo.active_member, 
        can_vote: memberInfo.voting_rights, 
        include_in_quorum: memberInfo.include_in_quorum, 
        receive_email_notifs: memberInfo.receive_not_present_email, 
        can_log_in: !(memberInfo.sign_in_blocked)
      })
      console.log("Parsed successfully")
      return typedUser as Member
    }
    catch (err) {
      return new Error("User not found")
    }
  }
}

export default AuthController