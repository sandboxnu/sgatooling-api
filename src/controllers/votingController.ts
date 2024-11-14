import { RowDataPacket } from "mysql2";
import { parseDataToVoteQuestion, VotingHistory } from "../types/types";
import { pool } from "../utils";

// I have the question
// have the questionId:

export class VotingController {
  // gets back the question for a user to be able to vote on
  async getValidQuestionForUser(member_id: string) {
    // select question with inner query to make sure the matching question id does
    // not exist in the history log
    const SELECT_FROM =
      "SELECT vq.uuid, vq.question, vq.description FROM VoteQuestion vq";
    const WHERE =
      " WHERE vq.time_start < NOW() AND vq.time_end > NOW() AND NOT EXISTS (";
    const innerQuery =
      "SELECT * FROM VoteHistory vh WHERE vq.uuid = vh.vote_id AND member_id = ? )";

    const totalQuery = SELECT_FROM + WHERE + innerQuery;
    const [result] = await pool.query(totalQuery, [member_id]);

    // This is essentially optional
    // (either returns back the question valid to vote on or an empty data) or nothing
    return result;
  }

  async getVostingHistoryForUser(member_id: string) {
    const SELECT = "SELECT question, vote_selection";
    const FROM =
      " FROM VoteQuestion JOIN VoteHistory ON VoteQuestion.uuid = VoteHistory.vote_id";
    const WHERE = " WHERE member_id = ?";

    const fullQuery = SELECT + FROM + WHERE;
    const [result] = await pool.query(fullQuery, [member_id]);

    return result;
  }

  // internal function to fetch data back from a created vote:
  async getVotingHistory(vote_data: string[]) {
    const SELECT_FROM = "SELECT * FROM VoteHistory ";
    const WHERE = "WHERE member_id = ? AND vote_id = ?";

    const totalQuery = SELECT_FROM + WHERE;
    const [result] = await pool.query(totalQuery, vote_data);

    // TODO: parsing on this back

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

    // subsequent query to get the item back
    const vote_data = [vote.member_id, vote.vote_id];

    const postedVote = this.getVotingHistory(vote_data);
    return postedVote;
  }
}
