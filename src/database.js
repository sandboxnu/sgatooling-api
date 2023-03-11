import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool ({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function getAllMembers () {
    const [result] = await pool.query("SELECT * FROM Members")
    return result
}

export async function getSpecificGroup (urlArgs){
    let initialString = `SELECT member_id, nuid,  first_name, last_name, email,  s_active, can_vote, receive_email_notifs, include_in_quorum, recieve_not_present_email,can_log_in
    FROM Members JOIN Membership M on Members.id = M.member_id JOIN \`Group\` G on M.group_id = G.id `

    let data;
    let index = 0
    let queryString = "WHERE "
    for (const item in urlArgs){
       if(index >= 1) {
        queryString += " AND "
       }

       if(item === 'group') {
        queryString += 'group_name = ?'
        data = [urlArgs[item]]
       }

       if(item === 'active') {
        queryString += 's_active'
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
    const [memberInfo] = await pool.query(`SELECT * FROM Members WHERE id = ?`, [id])
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
    bodyData.voting_rights,
    bodyData.recieve_email_notifs,
    bodyData.include_in_quorum,
    bodyData.receive_not_present_email,
    bodyData.sign_in_blocked])

    console.log(result)

    const id = result.insertId
    const member = await getMember(id)
    return member
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



