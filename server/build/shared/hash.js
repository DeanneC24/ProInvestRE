"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyHash = exports.hashString = void 0;
const argon2_1 = __importDefault(require("argon2"));
async function hashString(data) {
    try {
        const hash = await argon2_1.default.hash(data);
        return hash;
    }
    catch (err) {
        throw new Error('Error hashing supplied string');
    }
}
exports.hashString = hashString;
async function verifyHash(data, hashedValue) {
    try {
        return await argon2_1.default.verify(hashedValue, data);
    }
    catch (err) {
        throw new Error(`Error verifying hash: ${err}`);
    }
}
exports.verifyHash = verifyHash;
