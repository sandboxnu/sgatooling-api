import express from "express";
import { membersRouter } from "./routes/memberRoutes.js";
import { eventRouter } from "../src/routes/eventRoutes.js";
import { attendanceRouter } from "./routes/attendanceRoutes.js";
/*
const attendances = require("./routes/attendanceRoutes.js");
*/
const PORT = 8080;
const app = express();
app.use(express.json());
// Members routes
app.use("/members", membersRouter);
// Events routes
app.use("/events", eventRouter);
// Attendance routes
app.use("/attendance-changes", attendanceRouter);
// Base route
app.use("/", (_req, res) => {
    res.status(404).send("Endpoint does not exist.");
});
app.listen(PORT, () => console.log(`Local Host is running on PORT: ${PORT}`));
//# sourceMappingURL=index.js.map