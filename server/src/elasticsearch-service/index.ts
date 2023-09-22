import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser';
import { test, getUser, checkIndexExists } from './queries/authentication'
import elasticClient from './client'

const elasticsearchService = express()
const PORT = 8040
elasticsearchService.use(bodyParser.json());
elasticsearchService.use(cors())

elasticsearchService.get('/', async (req, res)  => {
    res.send('Hello World from elasticsearchService')
})

elasticsearchService.get('/test', async (req, res) => {
    res.json('Successfully pinged elasticsearch node')
})

elasticsearchService.get('/user-index-exists', async (req, res) => {
    try {
        const usersIndexExists = await checkIndexExists(elasticClient, 'users')
        console.log(`From index ${usersIndexExists}`)
        res.json(String(usersIndexExists))
    } catch (err) {
        console.error(err)
    }
})

elasticsearchService.get('/getUser', async (req, res) => {
    // todo improve error handling with http responses
    try {
        const username: string | undefined  = req.query.username as string | undefined
        console.log(typeof username)
        console.log(username)
        if (typeof username !== 'undefined') {
            const user: object = await getUser(elasticClient, username)
            res.json(user)
        }
    } catch (err) {
        console.error(`Issue retrieving user from data store: `, err)
    }
})

elasticsearchService.listen(PORT, () => {
    console.log(`Elasticsearch service is running on http://localhost:${PORT}`)
})

export default elasticsearchService