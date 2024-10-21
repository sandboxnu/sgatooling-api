import { RowDataPacket } from "mysql2";
import {
  parseDataToVoteQuestion,
  VHQuery,
  VotingHistory,
} from "../types/types";
import { isEmpty, pool } from "../utils";

export class VotingController {
  // async getMostRecentQuestion() {
  //   const SELECTFROM = "SELECT uuid, question, description FROM VoteQuestion ";
  //   const WHERE = "WHERE time_start < NOW() AND time_end > NOW()";
  //   const totalQuery = SELECTFROM + WHERE;

  //   const [result] = await pool.query(totalQuery);
  //   return result;
  // }

  async determineQuestion(member_id: string) {
    const SELECTFROM =
      "SELECT vq.question, vq.description FROM VoteQuestion vq";
    const WHERE =
      "vq.time_start < NOW() AND vq.time_end > NOW() AND NOT EXISTS(";
    const innerQuery =
      " SELECT 1 FROM VoteHistory vh WHERE vq.uuid = vh.vote_id AND member_id = ?";

    const totalQuery = SELECTFROM + WHERE + innerQuery;
    const [result] = await pool.query(totalQuery, [member_id]);
    return result;
  }

  // async getIfMemberVoted(member_id: string) {
  //   // TODO: maybe check if we need an async?
  //   const currentQuestion = await this.getMostRecentQuestion();

  //   const parsedQuestion = currentQuestion as RowDataPacket[];

  //   // if there is not a currentQuestion Return Blank
  //   if (!parsedQuestion) {
  //     return [];
  //   }

  //   // with the currentQuestion check based on the uuid, check if we have
  //   const SELECT = "SELECT * FROM VoteHistory ";
  //   const WHERE = "WHERE vote_id = ? AND member_id = ?";
  //   const totalQuery = SELECT + WHERE;

  //   const data = [parsedQuestion[0].uuid, member_id];
  //   const [result] = await pool.query(totalQuery, data);

  //   // if we found a corresponding vote for this question, show that no vote is available;
  //   if (!isEmpty(result)) {
  //     return [];
  //   }

  //   // else return the question
  //   return parsedQuestion;
  // }

  async getVotingHistory(primaryKeys: string[]) {
    const SELECTFROM = "SELECT * FROM VoteHistory";
    let WHERE = "WHERE member_id = ? AND vote_id = ?";

    const totalQuery = SELECTFROM + WHERE;
    const [result] = await pool.query(totalQuery, primaryKeys);

    return result;
  }

  async getMembersPastVotes(member_id: string) {
    const SELECT = "SELECT question, vote_selection FROM ";
    const JOIN =
      "VoteQuestion JOIN VoteHistory ON VoteQuestion.uuid = VoteHistory.vote_id ";
    const WHERE = "WHERE member_id = ?";

    const fullQuery = SELECT + JOIN + WHERE;
    const [result] = await pool.query(fullQuery, [member_id]);

    // TODO: add types for this
    return result;
  }

  async createVote(vote: VotingHistory) {
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
    const [result] = await pool.query(totalString, values);
    // subsequent query to get the item back (primary keys)
    const query = [vote.member_id, vote.vote_id];

    const postedVote = this.getVotingHistory(query);
    return postedVote;
  }
}

// const validParmsToQuery = new Map([
//   ["member_id", "member_id = ?"],
//   ["vote_id", "vote_id = ?"],
// ]);

// for (let i = 0; i < Object.keys(queryParams).length; i++) {
//   const currKey = Object.keys(queryParams)[i];
//   if (validParmsToQuery.has(currKey)) {
//     if (WHERE) {
//       WHERE += " AND " + validParmsToQuery.get(currKey);
//     } else {
//       WHERE += " WHERE " + validParmsToQuery.get(currKey);
//     }
//     data.push(Object.values(queryParams)[i]);
//   }
// }
