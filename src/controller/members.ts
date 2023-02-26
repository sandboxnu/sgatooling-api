import { Member } from "../types/member.js";
import localDb from "../example_data.json"
//maybe want to return back specific errors?

class MembersController {
    //methods necessary create a new member
    getMembers(): Member[] {
        const members = localDb["Members"]
        return members
    }
    /*
    createMember(): Member {
        //if successful get back something, or undefined, so throw an error
        //validation checks:


    }
    */
   
    //get a member based on id
    getMember(id: number): Member | undefined {
        const members = localDb["Members"][id]
        return members
    }    


}

export default MembersController;