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
      firstName: member.first_name,
      lastName: member.last_name,
      email: member.email,
      activeMember: castBufferToBoolean(member.active_member),
      votingRights: castBufferToBoolean(member.voting_rights),
      includeInQuorum: castBufferToBoolean(member.include_in_quorum),
      receiveNotPresentEmail: castBufferToBoolean(
        member.receive_not_present_email
      ),
      signInBlocked: castBufferToBoolean(member.sign_in_blocked),
    });
    return typedUser as Member;
  }
}

export default AuthController;
