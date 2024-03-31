import { VercelRequest } from "@vercel/node";
import dotenv from "dotenv";
dotenv.config();
import * as mysql2 from "mysql2";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

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

export const castBufferToBoolean = (data: any) => {
  return data.readUInt8() === 1;
};

export const verifyJWTRequest = (req: VercelRequest) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token || !process.env.JWT_SECRET) return false;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err: unknown) {
    return err;
  }
};
