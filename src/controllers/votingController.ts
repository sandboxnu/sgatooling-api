import { RowDataPacket } from "mysql2";
import {
  parseDataToVoteQuestion,
  VHQuery,
  VotingQuestion,
  VotingQuestionSchema,
} from "../types/types";
import { pool } from "../utils";

export class VotingController {
  async getAllQuestions() {
    const [data] = await pool.query(`SELECT * from VoteQuestion`);

    const parsedData = data as RowDataPacket[];
    const quesitonList = parsedData
      .map((question) => {
        try {
          return parseDataToVoteQuestion(question);
        } catch (err) {
          return null;
        }
      })
      .filter(Boolean);

    return quesitonList;

    //return the value afterwards
  }

  async getVotingHistory(queryParams: VHQuery) {
    // if have both vote_id/member_id => we are trying to find whether they already voted for the event
    // if we have just member_id => we want to find the members voting Records to be displayed
    const SELECTFROM = "SELECT * FROM VoteHistory";
    let WHERE = "";
    let data = [];

    const validParmsToQuery = new Map([
      ["member_id", "member_id = ?"],
      ["vote_id", "vote_id = ?"],
    ]);

    for (let i = 0; i < Object.keys(queryParams).length; i++) {
      const currKey = Object.keys(queryParams)[i];
      if (validParmsToQuery.has(currKey)) {
        if (WHERE) {
          WHERE += " AND " + validParmsToQuery.get(currKey);
        } else {
          WHERE += " WHERE " + validParmsToQuery.get(currKey);
        }
        // TODO: refactor the AttendanceChange one if this works
        data.push(Object.values(queryParams)[i]);
      }
    }

    const totalQuery = SELECTFROM + WHERE;
    const [result] = await pool.query(totalQuery, data);

    return result;
  }

  // TODD: this is bugged on the frontend
  async createVote() {
    // given a specific type from the body: member_id, vote_id, and their response -> create a new entry
  }
}
