import dotenv from "dotenv";
dotenv.config();
import express from "express";
import session from "express-session"
import sqlite3 from 'sqlite3'
import sqliteStoreFactory from 'express-session-sqlite'
import passport from "passport";



const SQLiteStore = sqliteStoreFactory(session)

const curStore = new SQLiteStore({
  driver: sqlite3.Database,
  // for in-memory database
  // path: ':memory:'
  path: '/tmp/sqlite.db',
  // Session TTL in milliseconds
  ttl: 24 * 60 * 60 * 1000,
  // (optional) Session id prefix. Default is no prefix.
  prefix: 'sess:',
})

export const prepareRouter = (app: express.Express) => {
  app.use(express.json())

  app.use(session({
    secret: 'sandbox is so cool',
    resave: false,
    saveUninitialized: false,
    store: curStore
  }))

  app.use(passport.authenticate('session'))

  app.use((req, res, next) => {
    const auth = req.isAuthenticated()
    if (auth) {
      console.log("Session Authenticated")
      next()
    }
    else {
      res.status(400).json("Session not authenticated")
    }
  })
}

  // app.use(passport.authenticate('session'));

  // app.use("/auth", authRouter)


  // })