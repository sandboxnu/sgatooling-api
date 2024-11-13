import { Member, parseDataToMemberType } from "../types/member";
import { PrismaClient } from "@prisma/client";

class AuthController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getMember(nuid: string, lastName: string): Promise<Member> {
    const memberInfo = await this.prisma.member.findMany({
      where: {
        nuid: nuid,
        last_name: lastName,
      }
    })

    if (!memberInfo.length) {
      throw new Error("Member not found");
    }
    const member = memberInfo[0];
    const typedUser = parseDataToMemberType(member);
    return typedUser as Member;
  }
}

export default AuthController;
