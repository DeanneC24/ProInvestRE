"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const authService_1 = require("./services/authService");
const authenticationService = (0, express_1.default)();
const PORT = 8010;
authenticationService.use(body_parser_1.default.json());
authenticationService.use((0, cors_1.default)());
authenticationService.get('/', async (req, res) => {
    res.send('Hello World from authenticationService');
});
// Real impl to uncomment after elasticsearch issues resolved
authenticationService.get('/auth-user', async (req, res) => {
    try {
        const username = req.query.username;
        const password = req.query.password;
        const validUser = await (0, authService_1.authenticateUser)(username, password);
        const isAdmin = username === 'admin' ? true : false;
        const resObj = {
            isValidUser: validUser,
            isAdmin: isAdmin
        };
        res.json(resObj);
    }
    catch (err) {
        console.error(err);
    }
});
authenticationService.get('/mock-auth-user', async (req, res) => {
    try {
        const username = req.query.username;
        const password = req.query.password;
        const isValidStr = req.query.isValid;
        const isValidBool = Boolean(isValidStr);
        const isAdmin = username === 'admin' ? true : false;
        const resObj = {
            isValidUser: isValidBool,
            isAdmin: isAdmin,
            user: {
                id: isAdmin ? 1 : 2,
                name: username
            }
        };
        res.json(resObj);
    }
    catch (err) {
        console.error(err);
    }
});
authenticationService.listen(PORT, () => {
    console.log(`Authentication service is running on http://localhost:${PORT}`);
});
exports.default = authenticationService;
