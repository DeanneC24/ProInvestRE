import dotenv from 'dotenv'
const path = require('path')
dotenv.config({ path: path.resolve(__dirname, '../.env')})

import cors from "cors"
import express, { Application, NextFunction, Request, Response, query } from "express"
import elasticsearchService from './elasticsearch-service/index'
import authenticationService from './authentication-service/index'
const PORT = 8080
const app = express()
app.use(cors())
app.use(express.json())

app.use('/auth', authenticationService)
app.use('/es', elasticsearchService)

app.listen(PORT, () => {
  console.log(`Main application is running on http://localhost:${PORT}`);
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World From ProInvestRe')
})
