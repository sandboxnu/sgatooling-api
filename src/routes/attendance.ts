import express from "express"
import {getAttendanceChange} from "../database.js"
const attendanceRouter = express.Router()

attendanceRouter.get("/", async (req,res) => {
    let item;
    //quick check to see if our req query is empty-> then do default behavior
    const isEmpty = (obj) => {
        for (var x in obj) {return false}
        return true
    }
    
    if(isEmpty(req.query)) {
        item = await getAttendanceChange();
    }
    else {
        //each case we can have:

    }

    res.send(item)
})

attendanceRouter.get("/:id", (req,res) => {

})

attendanceRouter.post("/", (req,res) => {
    //members/routers
})

export {attendanceRouter}