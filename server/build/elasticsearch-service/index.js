"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const authentication_1 = __importDefault(require("./queries/authentication"));
const client_1 = __importDefault(require("./client"));
const elasticsearchService = (0, express_1.default)();
const PORT = 8010;
const esAdminClient = (0, client_1.default)('admin');
const esaPublicClient = (0, client_1.default)('public');
elasticsearchService.use(body_parser_1.default.json());
elasticsearchService.get('/', async (req, res) => {
    res.send('Hello World from elasticsearchService');
});
elasticsearchService.get('/getUser', async (req, res) => {
    // todo improve error handling with http responses
    try {
        const username = req.query.username;
        if (typeof username !== 'undefined') {
            const user = await (0, authentication_1.default)(esAdminClient, username);
            res.json(user);
        }
    }
    catch (err) {
        console.error(`Issue retrieving user from data store`);
    }
});
elasticsearchService.listen(PORT, () => {
    console.log(`Elasticsearch service is running on http://localhost:${PORT}`);
});
exports.default = elasticsearchService;
