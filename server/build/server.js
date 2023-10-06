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
const index_2 = __importDefault(require("./authentication-service/index"));
const passport_1 = __importDefault(require("passport"));
const axios_1 = __importDefault(require("axios"));
const express_session_1 = __importDefault(require("express-session"));
const passport_local_1 = require("passport-local");
const PORT = 8080;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/auth', index_2.default);
app.use('/es', index_1.default);
app.use((0, express_session_1.default)({
    secret: "secret",
    resave: false,
    saveUninitialized: true
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
const authUser = async (user, password, done) => {
    console.log(`Value of "User" in authUser function ----> ${user}`); //passport will populate, user = req.body.username
    console.log(`Value of "Password" in authUser function ----> ${password}`); //passport will popuplate, password = req.body.password
    // Call Auth service to obtain response
    const params = {
        username: user,
        password: password,
        isValid: true // for mock/ testing purposes only
    };
    const authServRes = await axios_1.default.get(// NB hard coded result here, to remove
    `${process.env.BACKEND_BASE_URL}/auth/mock-auth-user?username=${user}&password=${password}&isValid=false`);
    let authenticated_user;
    console.log(authServRes.data.isValidUser);
    if (authServRes.data.isValidUser) {
        authenticated_user = authServRes.data.user; // TODO ensure auth repsonse matches expectation here 
    }
    else {
        authenticated_user = false;
    }
    return done(null, authenticated_user);
};
passport_1.default.use(new passport_local_1.Strategy(authUser));
passport_1.default.serializeUser((userObj, done) => {
    done(null, userObj);
});
passport_1.default.deserializeUser((userObj, done) => {
    done(null, userObj);
});
const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};
app.listen(PORT, () => {
    console.log(`Main application is running on http://localhost:${PORT}`);
});
app.get('/admin-login', (req, res) => {
    res.send("login.ejs");
});
app.post('/admin-login', passport_1.default.authenticate('local'), (req, res) => {
    res.json({ success: true, username: req.user });
});
app.get('/', (req, res) => {
    res.send('Hello World From ProInvestRe');
});
app.get('/hidden-admin-endpoint', checkAuthenticated, (req, res) => {
    res.send("Welcome to the hidden admin page");
});
