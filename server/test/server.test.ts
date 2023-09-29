import supertest from 'supertest'
import express, { Express, Request, Response } from 'express'
import cors from 'cors'

const app: Express = express()
const PORT = 8080

app.use(cors())
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World')
})

const request = supertest(app)

describe('Server', () => {
  it('should respond with "Hello World"', async () => {
    const response = await request.get('/')
    expect(response.status).toBe(200)
    expect(response.text).toBe('Hello World')
  })
})
