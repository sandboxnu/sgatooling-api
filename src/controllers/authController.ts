import { Member, parseDataToMemberType } from "../types/member";
import { pool } from "../utils";
import { RowDataPacket } from "mysql2";

class AuthController {
  async getMember(nuid: string, lastName: string): Promise<Member> {
    const [memberInfo] = await pool.query(
      `SELECT * FROM Member WHERE nuid = ? AND last_name = ?`,
      [nuid, lastName]
    );
    if (!(memberInfo as RowDataPacket[]).length) {
      throw new Error("Member not found");
    }
    const member = (memberInfo as RowDataPacket[])[0];
    const typedUser = parseDataToMemberType(member);
    return typedUser as Member;
  }
}

export default AuthController;
