import { VercelRequest, VercelResponse } from "@vercel/node";
import AuthController from "../src/controllers/authController";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";


const secret = process.env.JWT_SECRET
const authController = new AuthController()

export default async(req: VercelRequest, res: VercelResponse) => {
  try {
    const member = await authController.getMember(req.query.id as string)

    if (!secret) {
      res.status(500).json({message: 'JWT Key Error'})
      return;
    }
    if (member.last_name !== req.query.password) {
      res.status(400).json({message: "Incorrect Password"})
    }
    else {
      const token = jwt.sign({ userId: member.uuid }, secret, { expiresIn: '1h' });
      res.status(200).json({jwt: token})
    }

  }
  catch (err) {
    res.status(400).json({message: "User Not Found", error: err})
  }
}