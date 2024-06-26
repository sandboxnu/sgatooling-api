import { pool, castBufferToBoolean } from "../utils";
import { Member, MemberSchema } from "../types/types";
import { RowDataPacket } from "mysql2";

class AuthController {
  async getMember(id: string): Promise<Member> {
    const [memberInfo] = await pool.query(
      `SELECT * FROM Member WHERE nuid = ?`,
      [id]
    );

    const member = (memberInfo as RowDataPacket[])[0];
    const typedUser = MemberSchema.parse({
      uuid: member.uuid,
      nuid: member.nuid,
      first_name: member.first_name,
      last_name: member.last_name,
      email: member.email,
      active_member: castBufferToBoolean(member.active_member),
      voting_rights: castBufferToBoolean(member.voting_rights),
      include_in_quorum: castBufferToBoolean(member.include_in_quorum),
      receive_not_present_email: castBufferToBoolean(
        member.receive_not_present_email
      ),
      sign_in_blocked: castBufferToBoolean(member.sign_in_blocked),
    });
    return typedUser as Member;
  }
}

export default AuthController;
