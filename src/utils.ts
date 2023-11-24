import dotenv from "dotenv";
dotenv.config();
import * as mysql2 from "mysql2";
import { v4 as uuidv4 } from "uuid";
import express from "express";
import { membersRouter } from "./routes/memberRoutes";
import { eventRouter } from "./routes/eventRoutes";
import { attendanceRouter } from "./routes/attendanceRoutes";
import { Request, Response, NextFunction } from "express";

//file to export useful functions for the rest of the files/tests
export const isEmpty = (obj: any) => {

  for (const x in obj) {
    if (x === 'key') {
      console.log("key detected")
      continue
    } else {
      console.log("something else also detected")
      console.log(obj)
      return false;
    }
  }
  console.log("Our object is returning true")
  return true
};

//database
export const pool = mysql2
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: 3306,
  })
  .promise();

//as the name suggests function that creates the 32 character UID strings as uids
export const createdRandomUID = (): string => {
  //uses the uuidv4 method and replaces the hypens with empty strings similar to how its implemented
  //in the python version
  return uuidv4().replace(/-/g, "");
};

const authApiKey = (req: Request, res: Response, next: NextFunction) => {
  const key = req.query.key
  if (key && process.env.API_KEY === key) {
    next()
  }
  else {
    return res.status(400).send("Incorrect API Key")
  }
}

//const to create a server, was using to test out jest, but not going well :(,
export const createServer = () => {
  const app = express();

  app.use(express.json());
  //app.use(cors());

  app.use(authApiKey)

  // Members routes
  app.use("/members", membersRouter);

  // Events routes
  app.use("/events", eventRouter);
  // Attendance routes

  app.use("/attendance-changes", attendanceRouter);

  // Base route
  app.use("/", (_req, res) => {
    res.status(404).send("Endpoint does not exist");
  });

  return app;
};
