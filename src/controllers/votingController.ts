import { PrismaClient } from "@prisma/client";
import { VoteType, VotingQuestionType,VoteQueryType } from "../types/voting";
export class VotingController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAllQuestions() {
    const questions = await this.prisma.voteQuestion.findMany();
    return questions.map(question => ({
      uuid: question.uuid,
      question: question.question ?? '',
      description: question.description ?? '',
      time_start: question.time_start ?? '',
      time_end: question.time_end ?? ''
    }));
  }

  async getVotingHistory(queryParams: VoteQueryType) {
    return await this.prisma.voteHistory.findMany({
      where: queryParams,
    });
  }

  async createVote(vote: VoteType) {
    return await this.prisma.voteHistory.create({
      data: vote,
    });
  }
}
