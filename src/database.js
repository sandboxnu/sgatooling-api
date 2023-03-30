import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool ({
    host: process.env.DB_HOST,
    //port: process.env.MYSQL_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
}).promise()

export async function getAllMembers () {
    //SELECT uuid, first_name, last_name, email, active_member, voting_rights, include_in_quorum, receive_not_present_email, sign_in_blocked FROM Member
    const [result] = await pool.query("SELECT uuid, first_name, last_name, email, active_member, voting_rights, include_in_quorum, receive_not_present_email, sign_in_blocked FROM Member")
    return result
}

export async function getSpecificGroup (urlArgs){
    //whats currently in the database is a little of with the ER diagram btw
    let initialString = `SELECT uuid, first_name, last_name, email, active_member, voting_rights, include_in_quorum, receive_not_present_email, sign_in_blocked
    FROM Member JOIN MemberGroup M on Member.uuid = M.person_id `

    for(let i = 0; i < urlArgs.length; i ++) {
        console.log(urlArgs[i])
    }

    //only group: New Senators Fall 2022
    //query for that: members?group=New%20Senators%20Fall%202022

    let data;
    let index = 0
    let queryString = "WHERE "
    for (const item in urlArgs){
       if(index >= 1) {
        queryString += " AND "
       }

       if(item === 'group') {
        queryString += 'membership_group = ?'
        data = [urlArgs[item]]
       }

       if(item === 'active') {
        queryString += 'active_member'
       }

       if(item === 'include-in-quorum') {
        queryString += 'include_in_quorum'
       }
       index ++ 
    }

    let totalString = initialString + queryString
    //meaning that we supply a value for groupname
    if(data) {
        const [result] = await pool.query(totalString, data)
        return result
        
    } else {
        const [result] = await pool.query(totalString)
        return result
    }
}

export async function getMember(id) {
    const [memberInfo] = await pool.query(`SELECT * FROM Members WHERE uuid = ?`, [id])
    return memberInfo
}


export async function createMember(bodyData) {
    //also note invalid createMember request still incremenet the id value
    const [result] = await pool.query(`
    INSERT INTO Members (nuid, first_name, last_name, email, s_active, can_vote, receive_email_notifs, include_in_quorum, recieve_not_present_email, can_log_in)
    VALUES (?, ?, ?, ?, ? , ?, ?, ?, ?, ? )`, 
    [
    bodyData.nuid,
    bodyData.first_name,
    bodyData.last_name,
    bodyData.email,
    bodyData.active,
    bodyData.can_vote,
    bodyData.receive_email_notifs,
    bodyData.include_in_quorum,
    bodyData.receive_not_present_email,
    bodyData.can_log_in])

    console.log(result)

    const id = result.insertId
    const member = await getMember(id)
    return member
} 

//going to split this up later
//const [result] = await pool.query("SELECT * FROM AttendanceRecord")

//table names: Report
//AttendanceChangeRequest
//AttendanceRecord
//Event
export async function getAttendanceChange() {
    //think i'm missing arrive_time
    const [result] = await pool.query("SELECT uuid, name, time_submitted, date_of_change, type, change_status, reason, time_leaving FROM AttendanceChangeRequest")
    return result
}

//idkif these are all supposed to be possible in the query string
export async function getAttendanceChangeLimit(limit) {

}

export async function getAttendanceChangeMember(memberid) {

}

export async function getAttendanceChangeEvent(eventid) {

}

export async function getSpecificAttendance(id) {

}

export async function createAttendanceChange(reqBody) {
    //how should we handle optional arguments that come in? 
}



/*
const testData = {
    nuid: "11111111",
    first_name: "something",
    last_name: "something",
    email: 'svb@email.com',
    active: true,
    voting_rights: true,
    recieve_email_notifs: true,
    include_in_quorum: true,
    receive_not_present_email: true,
    sign_in_blocked: false
}
*/



