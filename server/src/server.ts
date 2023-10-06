import dotenv from 'dotenv'
const path = require('path')
dotenv.config({ path: path.resolve(__dirname, '../.env')})

import cors from "cors"
import express, { Application, NextFunction, Request, Response, query } from "express"
import elasticsearchService from './elasticsearch-service/index'
import authenticationService from './authentication-service/index'
import passport from 'passport'
import axios from 'axios'
import session from 'express-session'
import { Strategy as LocalStrategy, VerifyFunction } from "passport-local"

const PORT = 8080
const app = express()
app.use(cors())
app.use(express.json())

app.use('/auth', authenticationService)
app.use('/es', elasticsearchService)
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: true 
}))

app.use(passport.initialize())
app.use(passport.session())

interface User {
  id: number
  name: string
}

interface AuthServiceParams {
  username: string,
  password: string,
  isValid: boolean
}
const authUser = async (
    user: string,
    password: string,
    done: (error: Error | null, user?: User | false) => void
  ) => {
  console.log(`Value of "User" in authUser function ----> ${user}`)         //passport will populate, user = req.body.username
  console.log(`Value of "Password" in authUser function ----> ${password}`) //passport will popuplate, password = req.body.password

   // Call Auth service to obtain response
  const params: AuthServiceParams = {
    username: user,
    password: password,
    isValid: true // for mock/ testing purposes only
  }
  const authServRes = await axios.get( // NB hard coded result here, to remove
    `${process.env.BACKEND_BASE_URL}/auth/mock-auth-user?username=${user}&password=${password}&isValid=false`
  )
  let authenticated_user
  console.log(authServRes.data.isValidUser)
  if (authServRes.data.isValidUser) {
    authenticated_user = authServRes.data.user // TODO ensure auth repsonse matches expectation here 
  } else {
    authenticated_user = false
  }
  return done (null, authenticated_user ) 
}

passport.use(new LocalStrategy (authUser))

passport.serializeUser( (userObj, done) => {
  done(null, userObj)
})

passport.deserializeUser( (userObj: User, done) => {
  done(null, userObj)
})

const checkAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) { return next() }
  res.redirect("/login")
}

app.listen(PORT, () => {
  console.log(`Main application is running on http://localhost:${PORT}`);
  console.log(`Check to see if env variables parsed from secrets. URL =: ${process.env.BACKEND_BASE_URL}`)
  console.log(`Check to see if env variables parsed from secrets. ES credentials =: ${process.env.ELASTICSEARCH_CREDENTIALS_INDEX}`)

})

app.get('/admin-login', (req, res) => {
  res.send("login.ejs")
})

app.post ('/admin-login', passport.authenticate('local'), (req, res) => {
  res.json({success: true, username: req.user})
})

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World From ProInvestRe')
})

app.get('/hidden-admin-endpoint', checkAuthenticated, (req: Request, res: Response) => {
  res.send("Welcome to the hidden admin page")
})