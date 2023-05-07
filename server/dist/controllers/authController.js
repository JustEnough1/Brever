"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSession = exports.logout = exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = req.session;
        if (session.userId) {
            const user = (yield User_1.UserModel.findById(session.userId));
            const profile = User_1.UserModel.getProfileFromUser(user);
            return res.json({ user: profile });
        }
        const { firstname, lastname, username, password } = req.body;
        const { hashedPassword, salt } = User_1.UserModel.hashPassword(password);
        const newUser = yield User_1.UserModel.save(username, hashedPassword, salt, firstname, lastname).catch((error) => {
            throw error;
        });
        session.userId = newUser.insertId;
        const user = yield User_1.UserModel.findById(session.userId);
        const profile = User_1.UserModel.getProfileFromUser(user);
        res.json({ user: profile });
    }
    catch (error) {
        res.send({
            message: "Cannot create new account. Try again later.",
        });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = req.session;
        if (session.userId) {
            const user = (yield User_1.UserModel.findById(session.userId));
            const profile = User_1.UserModel.getProfileFromUser(user);
            return res.json({ user: profile });
        }
        const { username, password } = req.body;
        const user = (yield User_1.UserModel.findByUsername(username));
        if (!user) {
            return res.status(400).json({
                message: "Wrong username or password.",
            });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({
                message: "Wrong username or password.",
            });
        session.userId = user.id;
        const profile = User_1.UserModel.getProfileFromUser(user);
        res.json({ user: profile });
    }
    catch (error) {
        res.json({ message: "Cannot log in. Try again later." });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = req.session;
        session.destroy((err) => {
            if (err)
                throw err;
            return res.json({ message: "User has been logged out." });
        });
    }
    catch (error) {
        res.json({ message: "Cannot log in. Try again later." });
    }
});
exports.logout = logout;
const checkSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = req.session;
        const user = User_1.UserModel.getProfileFromUser(yield User_1.UserModel.findById(session.userId));
        return res.json(user);
    }
    catch (error) {
        res.json({ message: "Cannot log in. Try again later." });
    }
});
exports.checkSession = checkSession;
