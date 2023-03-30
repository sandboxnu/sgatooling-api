import cors from "cors"; 
import express from "express";

const members = require("./routes/membersRoutes"); 
const events = require("./routes/eventRoutes");
const attendances = require("./routes/attendanceRoutes.js"); 

const PORT = 8080;

const app = express(); 
app.use(express.json()); 
app.use(cors()); 


// Members routes 
app.use("/members", members); 
// Events routes 
app.use("/events", events);
// Attendance routes 
app.use("/attendance-changes", attendances); 


// Base route
app.use("/", (_req, res) => {
  res.status(404).send("Endpoint does not exist.");
});

app.use("/attendance-changes", attendanceRouter);

app.listen(PORT, () => console.log(`Local Host is running on PORT: ${PORT}`))