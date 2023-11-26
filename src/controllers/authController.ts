import { isEmpty, pool } from "../utils";
import { Member, MemberSchema } from "../types/types";
import { z } from "zod";
import { RowDataPacket } from "mysql2";


class AuthController {
  async getMember(id: string): Promise<Member> {
    const [memberInfo] = await pool.query(
      `SELECT * FROM Member WHERE uuid = ?`,
      [id]
    )
      const member = (memberInfo as RowDataPacket[])[0]
      const typedUser = MemberSchema.parse({
        uuid: member.uuid, 
        first_name: member.first_name, 
        last_name: member.last_name, 
        email: member.email, 
        active_member: !!member.active_member, 
        can_vote: !!member.voting_rights, 
        include_in_quorum: !!member.include_in_quorum, 
        receive_email_notifs: !!member.receive_not_present_email, 
        can_log_in: !(member.sign_in_blocked)
      })
      return typedUser as Member
  }
}

export default AuthController