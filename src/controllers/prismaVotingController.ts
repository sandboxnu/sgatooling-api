import { PrismaClient } from "@prisma/client";
import { VHQuery, VotingHistory } from "../types/types";
export class PrismaVotingController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAllQuestions() {
    return await this.prisma.voteQuestion.findMany();
  }

  async getVotingHistory(queryParams: VHQuery) {
    return await this.prisma.voteHistory.findMany({
      where: queryParams,
    });
  }

  async createVote(vote: VotingHistory) {
    return await this.prisma.voteHistory.create({
      data: vote,
    });
  }
}
