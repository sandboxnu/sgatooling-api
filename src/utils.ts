import dotenv from "dotenv";
dotenv.config();
import * as mysql2 from "mysql2";
import { v4 as uuidv4 } from "uuid";
import express from "express";
import { membersRouter } from "./routes/memberRoutes";
import { eventRouter } from "./routes/eventRoutes";
import { attendanceRouter } from "./routes/attendanceRoutes";

//file to export useful functions for the rest of the files/tests
export const isEmpty = (obj: any) => {
  for (const x in obj) {
    return false;
  }
  return true;
};

//database
export const pool = mysql2
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: 3307,
  })
  .promise();

//as the name suggests function that creates the 32 character UID strings as uids
export const createdRandomUID = (): string => {
  //uses the uuidv4 method and replaces the hypens with empty strings similar to how its implemented
  //in the python version
  return uuidv4().replace(/-/g, "");
};

//const to create a server, was using to test out jest, but not going well :(,
export const createServer = () => {
  const app = express();

  app.use(express.json());
  //app.use(cors());

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

  return app;
};
