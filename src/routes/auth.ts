import express from "express"
import passport, { Passport } from "passport";
import { Strategy } from "passport-local";
import AuthController from "../controllers/authController";


const authRouter = express.Router();
const authController = new AuthController()

passport.use(new Strategy((username, password, done) => {
  authController.getMember(username).then(
    (data) => {
      if (data instanceof Error) {
        done(undefined, false, {message: 'User not found'})
      }
      else if (data.last_name !== password) {
        done(undefined, false, {message: 'NUID and Last Name do not match'})
      }
    }
  )
}))

authRouter.post('/login', passport.authenticate('local'), async (req, res) => {
  res.status(200).json({user: req.user, message: "authorized"})
})

