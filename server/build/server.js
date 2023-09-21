"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path = require('path');
dotenv_1.default.config({ path: path.resolve(__dirname, '../.env') });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./elasticsearch-service/index"));
const PORT = 8080;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/es', index_1.default);
app.listen(PORT, () => {
    console.log(`Main application is running on http://localhost:${PORT}`);
});
app.get('/', (req, res) => {
    res.send('Hello World');
});
