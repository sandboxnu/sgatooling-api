import express from "express"
import passport from "passport";
import { SessionOptions } from "passport";
import { Strategy } from "passport-local";
import AuthController from "../controllers/authController";
import { Member, MemberQuery, MemberSchema } from "../types/types";
import { assert } from "console";


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
    console.log("Error while authenticating", err)
  })
}))

passport.serializeUser(function(user, done) {
  const typedUser = MemberSchema.parse(user)
  done(undefined, typedUser.uuid)
});

passport.deserializeUser(function(id, done) {
  authController.getMember(id as string).then((data) => {
    done(undefined, data)
  }).catch((err) => {
    console.log("Error while deserializing", err)
  })
});

authRouter.post('/login', passport.authenticate('local'), async (req, res) => {
  console.log(req)
  res.status(200).json({message: "authorized"});
})

export {authRouter}

