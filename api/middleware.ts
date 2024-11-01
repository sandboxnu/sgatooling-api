import { VercelApiHandler, VercelRequest, VercelResponse } from "@vercel/node";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

// Cors wrapper used on each function
export const allowCors =
  (handler: VercelApiHandler) =>
  async (req: VercelRequest, res: VercelResponse) => {
    res.setHeader("Access-Control-Allow-Credentials", "true");

    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,OPTIONS,PATCH,DELETE,POST,PUT"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    );

    if (req.method === "OPTIONS") {
      return res.status(200).json({
        body: "OK",
      });
    }

    return await handler(req, res);
  };

export const isAuthenticated = (handler: VercelApiHandler) => {
  async (req: VercelRequest, res: VercelResponse) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      if (!process.env.JWT_SECRET) {
        return res.status(500).json({ error: "JWT Key Error" });
      }

      jwt.verify(token, process.env.JWT_SECRET);
      return await handler(req, res);
    } catch (_e: any) {
      let e: Error = _e;
      if (e.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Unauthorized" });
      }
      return res.status(500).json({ error: "Unknown Error" });
    }
  };
};
