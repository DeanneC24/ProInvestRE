"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const axios_1 = __importDefault(require("axios"));
const hash_1 = require("../../shared/hash");
const authenticateUser = async (username, password) => {
    try {
        if (username === undefined || password === undefined) {
            console.log('Username or password is undefined');
            return false;
        }
        const esGetUserResponse = await axios_1.default.get(`http://localhost:8010` // TODO remove hardcode
        );
        const userProfile = esGetUserResponse.data;
        if (Object.keys(userProfile).length === 0) {
            console.log(`User ${username} not found`);
            return false;
        }
        const passwordsMatch = await (0, hash_1.verifyHash)(password, userProfile.password);
        if (passwordsMatch) {
            console.log(`User ${username} authenticated successfully.`);
            return true;
        }
        else {
            console.log(`Authentication failed for user ${username}.`);
            return false;
        }
    }
    catch (err) {
        console.log(`Error authenticating user: `, err);
        return false;
    }
};
exports.authenticateUser = authenticateUser;
