import { VercelRequest, VercelResponse } from "@vercel/node";
import AuthController from "../src/controllers/authController";

const authController = new AuthController()

export default async(req: VercelRequest, res: VercelResponse) => {
  try {
    console.log(req.query)
    const member = await authController.getMember(req.query.id as string)
    if (member.last_name !== req.query.password) {
      res.status(400).json({message: "Incorrect Password"})
    }
    else {
      res.status(200).json({message: "Authorized"})
    }

  }
  catch (err) {
    res.status(400).json({message: "User Not Found", error: err})
  }
}