import { RowDataPacket } from "mysql2";
import { isEmpty, pool, createdRandomUID } from "../utils";
import {
  parseDataToMemberType,
  GetMembersParamsType,
  Member,
} from "../types/member";
import { parseTagType } from "../types/tags";
import { PrismaClient } from "@prisma/client";

export class MemberController {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAllMembers() {
    const members = await this.prisma.member.findMany();
    return members.map((member) => ({
      uuid: member.uuid,
      nuid: member.nuid,
      first_name: member.first_name,
      last_name: member.last_name,
      email: member.email,
      active_member: member.active_member,
      //can_vote: member.can_vote,
      //receive_email_notifs: member.receive_email_notifs,
      include_in_quorum: member.include_in_quorum,
      //can_log_in: member.can_log_in
    }));
  }

  async getSpecificGroup(urlArgs: GetMembersParamsType) {
    return await this.prisma.member.findMany({
      include: {
        group_id: true
      },
      where: {
        //group_id: urlArgs.group,
        active_member: urlArgs.active,
        include_in_quorum: urlArgs.includeInQuorum,
      },
    });
  }

  async createMember(bodyData: Member) {
    return await this.prisma.member.create({
      data: {
        uuid: createdRandomUID(),
        nuid: bodyData.nuid,
        first_name: bodyData.firstName,
        last_name: bodyData.lastName,
        email: bodyData.email,
        active_member: bodyData.activeMember,
        voting_rights: bodyData.votingRights,
        receive_not_present_email: bodyData.receiveNotPresentEmail,
        include_in_quorum: bodyData.includeInQuorum,
        sign_in_blocked: !bodyData.signInBlocked,
      },
    });
  }

  async getMember(id: string) {
    return await this.prisma.member.findUnique({
      where: {
        uuid: id,
      },
    });
  }

  async getMemberTags(id: string) {
    const data = await this.prisma.memberGroup.findMany({
      where: {
        person_id: id,
      },
      select: {
        membership_group: true,
      },
    });

    const Tags = data.map((element) =>
      parseTagType({
        membership_group: element.membership_group,
      })
    );

    return Tags;
  }

  async updateMemberPreferences(id: string) {
    // Fetch the current value of receive_not_present_email
    const member = await this.prisma.member.findUnique({
      where: { uuid: id },
      select: { receive_not_present_email: true },
    });

    if (!member) {
      throw new Error(`Member with id ${id} not found`);
    }

    // Toggle the value of receive_not_present_email
    const updatedMember = await this.prisma.member.update({
      where: { uuid: id },
      data: { receive_not_present_email: !member.receive_not_present_email },
    });

    return updatedMember;
  }
}
