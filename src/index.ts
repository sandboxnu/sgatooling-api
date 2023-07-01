//import cors from "cors";
import express from "express";
import { membersRouter } from "./routes/memberRoutes.js";
import { eventRouter } from "../src/routes/eventRoutes.js";
import { attendanceRouter } from "./routes/attendanceRoutes.js";
import { createServer } from "./utils.js";

/*
const attendances = require("./routes/attendanceRoutes.js");
*/

const PORT = 8080;
const app = createServer();

app.listen(PORT, () => console.log(`Local Host is running on PORT: ${PORT}`));
