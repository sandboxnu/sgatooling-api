import { RowDataPacket } from "mysql2";
import { pool } from "../utils";
import { parseDataToVote, VoteQueryType, VoteType } from "../types/voting";

export class VotingController {
  async getAllQuestions() {
    const [data] = await pool.query(`SELECT * from VoteQuestion`);

    const parsedData = data as RowDataPacket[];
    const quesitonList = parsedData
      .map((question) => {
        try {
          return parseDataToVote(question);
        } catch (err) {
          return null;
        }
      })
      .filter(Boolean);

    return quesitonList;
  }

  // if have both vote_id/member_id => we are trying to find whether they already voted for the event
  // if we have just member_id => we want to find the members voting Records to be displayed
  async getVotingHistory(queryParams: VoteQueryType) {
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
        data.push(Object.values(queryParams)[i]);
      }
    }

    const totalQuery = SELECTFROM + WHERE;
    const [result] = await pool.query(totalQuery, data);

    return result;
  }

  async createVote(vote: VoteType) {
    const keys = Object.keys(vote);
    const values = Object.values(vote);

    let initialQuery = "INSERT INTO VoteHistory ( ";
    let initialValue = " Values ( ";

    for (let index = 0; index < keys.length; index++) {
      const item = keys[index];
      //unless we are at the last index:
      if (index !== keys.length - 1) {
        initialQuery += item + ", ";
        initialValue += "?, ";
      } else {
        initialQuery += item + ")";
        initialValue += "?)";
      }
    }

    const totalString = initialQuery + initialValue;
    // primary keys for
    const [result] = await pool.query(totalString, values);
    // subsequent query to get the item back
    const query = {
      member_id: vote.member_id,
      vote_id: vote.vote_id,
    };

    const postedVote = this.getVotingHistory(query);
    return postedVote;
  }
}
