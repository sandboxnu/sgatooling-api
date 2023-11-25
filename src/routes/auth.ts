import express from "express"
import passport from "passport";
import { Strategy } from "passport-local";
import AuthController from "../controllers/authController";


const authRouter = express.Router();
const authController = new AuthController()

passport.use(new Strategy((username, password, done) => {
  authController.getMember(username).then(
    (data) => {
      console.log(username)
      if (data instanceof Error) {
        console.log("Error", data)
        done(undefined, false, {message: 'User not found'})
      }
      else if (data.last_name !== password) {
        console.log("last name no match")
        done(undefined, false, {message: 'NUID and Last Name do not match'})
      }
      else {
        done(undefined, data)
      }
    }
  ).catch((err) => {
    console.log("error thrown", err)
  })
}))

authRouter.post('/login', passport.authenticate('local'), async (req, res) => {
  console.log(req)
  res.status(200).json({message: "authorized"});
})

export {authRouter}

