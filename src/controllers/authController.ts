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
      const typedUser = MemberSchema.parse(memberInfo)
      console.log("Parsed successfully")
      return typedUser as Member
    }
    catch (err) {
      return new Error("User not found")
    }
  }
}

export default AuthController