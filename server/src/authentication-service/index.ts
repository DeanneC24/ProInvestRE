import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { authenticateUser } from './services/authService'

const authenticationService = express()
const PORT = 8012
authenticationService.use(bodyParser.json());
authenticationService.use(cors())

authenticationService.get('/', async (req, res)  => {
    res.send('Hello World from authenticationService')
});

authenticationService.get('/auth-user', async (req, res) => {
    try {
        const username: string | undefined  = req.query.username as string | undefined
        const password: string | undefined  = req.query.username as string | undefined
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

authenticationService.listen(PORT, () => {
    console.log(`Authentication service is running on http://localhost:${PORT}`)
})

export default authenticationService