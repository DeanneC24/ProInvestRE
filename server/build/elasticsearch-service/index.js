"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const authentication_1 = require("./queries/authentication");
const client_1 = __importDefault(require("./client"));
const elasticsearchService = (0, express_1.default)();
const PORT = 8010;
elasticsearchService.use(body_parser_1.default.json());
elasticsearchService.use((0, cors_1.default)());
const esAdminClient = (0, client_1.default)('admin');
elasticsearchService.get('/', async (req, res) => {
    res.send('Hello World from elasticsearchService');
});
elasticsearchService.get('/test', async (req, res) => {
    res.json('Successfully pinged elasticsearch node');
});
elasticsearchService.get('/user-index-exists', async (req, res) => {
    try {
        const usersIndexExists = await (0, authentication_1.checkIndexExists)(esAdminClient, 'users');
        console.log(`From index ${usersIndexExists}`);
        res.json(String(usersIndexExists));
    }
    catch (err) {
        console.error(err);
    }
});
elasticsearchService.get('/getUser', async (req, res) => {
    // todo improve error handling with http responses
    try {
        const username = req.query.username;
        console.log(typeof username);
        console.log(username);
        if (typeof username !== 'undefined') {
            const user = await (0, authentication_1.getUser)(esAdminClient, username);
            res.json(user);
        }
    }
    catch (err) {
        console.error(`Issue retrieving user from data store: `, err);
    }
});
elasticsearchService.listen(PORT, () => {
    console.log(`Elasticsearch service is running on http://localhost:${PORT}`);
});
exports.default = elasticsearchService;
