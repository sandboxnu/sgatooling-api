import { VercelApiHandler, VercelRequest, VercelResponse } from "@vercel/node";
import dotenv from "dotenv";
dotenv.config();

// TODO: middlware will need to extend JWTs/ session Requests for any route not on the auth endpoint

// Cors wrapper used on each function
const allowCors =
  (handler: VercelApiHandler) =>
  async (req: VercelRequest, res: VercelResponse) => {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "*");

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

    // JWT guard -> check on any incoming request coming in whether they have a valid JWT that can be parsed
    // only if this is production in the future
    //

    return await handler(req, res);
  };

export default allowCors;
