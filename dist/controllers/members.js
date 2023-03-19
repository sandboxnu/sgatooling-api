import localDb from "../local_db.js";
class MembersController {
    getAllMembers() {
        return localDb["Members"];
    }
    //get all members from a particular set within a particular group 
    getGroupMembers(suppliedGroup, members) {
        const groups = localDb["Group"];
        let groupid;
        for (const group of groups) {
            if (group.group_name === suppliedGroup) {
                groupid = group.id;
            }
        }
        const Membership = localDb["Membership"];
        const memberids = [];
        for (const membership of Membership) {
            if (membership["group_id"] == groupid) {
                memberids.push(membership.membership_id);
            }
        }
        const found = members.filter(member => memberids.includes(member.id));
        if (found) {
            return found;
        }
        else {
            //throw an error here
        }
    }
    //get all quorum members based on a particular set
    getQuorumMembers(members) {
        const found = members.filter(members => members["include_in_quorum"] === true);
        if (found.length != 0) {
            return members;
        }
        else {
            //throw an error
        }
    }
    //get only active members, based on a particular set of members
    getActiveMembers(members) {
        const found = members.filter(members => members["active"] === true);
        if (found.length != 0) {
            return members;
        }
        else {
            //throw and error
        }
    }
    createMember(bodyData) {
        const newId = localDb["Members"].length + 1;
        const newMember = {
            id: newId,
            nuid: bodyData.nuid,
            first_name: bodyData.first_name,
            last_name: bodyData.last_name,
            email: bodyData.email,
            active: bodyData.active,
            can_vote: bodyData.voting_rights,
            receive_email_notifs: bodyData.recieve_email_notifs,
            include_in_quorum: bodyData.include_in_quorum,
            receive_not_present_email: bodyData.receive_not_present_email,
            can_log_in: bodyData.sign_in_blocked,
        };
        localDb["Members"].push(newMember);
        return newMember;
    }
    //get a member based on id
    getMember(id) {
        const members = localDb["Members"];
        if (id > members.length || id < 0) {
            //throw an error or maybe return undefined?
        }
        for (const member of members) {
            if (member.id === id) {
                return member;
            }
        }
    }
}
export default MembersController;
//# sourceMappingURL=members.js.map