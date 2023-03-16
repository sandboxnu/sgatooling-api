import express from "express";
import {membersRouter} from "./routes/members.js"
import { attendanceRouter } from "./routes/attendance.js";

const PORT = 8080;
const app = express();

app.use(express.json())

app.use("/members", membersRouter);

app.use("/attendance-changes", attendanceRouter);

app.listen(PORT, () => console.log(`Local Host is running on PORT: ${PORT}`))