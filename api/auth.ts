import { VercelRequest, VercelResponse } from "@vercel/node";
import AuthController from "../src/controllers/authController";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import allowCors from "./middleware";

const secret = process.env.JWT_SECRET;
const authController = new AuthController();

// TODO: come back to this route since auth should be used on each route as well in the middleware
const auth = async (req: VercelRequest, res: VercelResponse) => {
  try {
    const member = await authController.getMember(
      req.body.nuid as string,
      req.body.lastName as string
    );

    if (!secret) {
      res.status(500).json({ error: "JWT Key Error" });
      return;
    }
    if (!member.activeMember) {
      res.status(403).json({ error: "User Not Active" });
    } else if (member.signInBlocked) {
      res.status(403).json({ error: "User Blocked" });
    } else {
      const token = jwt.sign({ data: member.id }, secret, {
        expiresIn: "1h",
      });
      res.status(200).json({ auth: { jwt: token } });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "User Not Found" });
  }
};

export default allowCors(auth);
