import dotenv from "dotenv";
dotenv.config();
import * as mysql2 from "mysql2";
import { v4 as uuidv4 } from "uuid";
import express from "express";
import { membersRouter } from "./routes/memberRoutes";
import { eventRouter } from "./routes/eventRoutes";
import { attendanceRouter } from "./routes/attendanceRoutes";
import { Request, Response, NextFunction } from "express";
import { authRouter } from "./routes/auth";
import session from "express-session"
import sqlite3 from 'sqlite3'
import sqliteStoreFactory from 'express-session-sqlite'
import passport from "passport";


//file to export useful functions for the rest of the files/tests
export const isEmpty = (obj: any) => {

  for (const x in obj) {
    if (x === 'key') {
      continue
    } else {
      return false;
    }
  }
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
    delete req.query.key
    next()
  }
  else {
    return res.status(400).send("Incorrect API Key")
  }
}

//function to create a server, was using to test out jest, but not going well :(,
export const createServer = () => {
  
  const app = express();

  const SQLiteStore = sqliteStoreFactory(session)

  app.use(express.json());
  //app.use(cors());
  //session?!
  app.use(session({
    secret: 'sandbox is so cool',
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({
      driver: sqlite3.Database,
      // for in-memory database
      // path: ':memory:'
      path: '/tmp/sqlite.db',
      // Session TTL in milliseconds
      ttl: 24 * 60 * 60 * 1000,
      // (optional) Session id prefix. Default is no prefix.
      prefix: 'sess:',
    })
  }))
  app.use(passport.authenticate('session'));

  //Authenticate all requests against API Key
  // Need to redo all the routes to ignore the key
  app.use(authApiKey)
  app.use("/auth", authRouter)

  app.use((req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }})

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
}

