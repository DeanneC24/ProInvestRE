import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { authenticateUser } from './services/authService'

const authenticationService = express()
const PORT = 8010
authenticationService.use(bodyParser.json())
authenticationService.use(cors())

authenticationService.get('/', async (req, res)  => {
    res.send('Hello World from authenticationService')
})

// Real impl to uncomment after elasticsearch issues resolved
authenticationService.get('/auth-user', async (req, res) => {
    try {
        const username: string | undefined  = req.query.username as string | undefined
        const password: string | undefined  = req.query.password as string | undefined
        const validUser = await authenticateUser(username, password)
        const isAdmin: boolean = username === 'admin' ? true : false
        const resObj = {
            isValidUser: validUser,
            isAdmin: isAdmin
        }
        res.json(resObj)
    } catch (err) {
        console.error(err)
    }
})

authenticationService.get('/mock-auth-user', async (req, res) => {
    try {
        const username: string | undefined  = req.query.username as string | undefined
        const password: string | undefined  = req.query.password as string | undefined
        const isValidStr: string | undefined = req.query.isValid as string | undefined
        const isValidBool: boolean = isValidStr?.toLowerCase() === 'true'
        const isAdmin: boolean = username === 'admin' ? true : false
        const resObj = {
            isValidUser: isValidBool,
            isAdmin: isAdmin,
            user: {
                id: isAdmin ? 1 : 2, // mock id, if it's admin id =1 otherwise 2
                name: username
            }
        }
        console.log(`User ${username} authenticated: ${isValidBool}`)
        res.json(resObj)
    } catch (err) {
        console.error(err)
    }
})

authenticationService.listen(PORT, () => {
    console.log(`Authentication service is running on http://localhost:${PORT}`) 
})

export default authenticationService