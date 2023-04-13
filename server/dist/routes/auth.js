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
exports.authRouter = void 0;
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
const validateUsername_1 = require("../middlewares/validateUsername");
const validatePassword_1 = require("../middlewares/validatePassword");
const validateName_1 = require("../middlewares/validateName");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/signup", validateUsername_1.validateUsername, validatePassword_1.validatePassword, validateName_1.validateName, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstname, lastname, username, password } = req.body;
        const salt = bcryptjs_1.default.genSaltSync(10);
        const hashedPassword = bcryptjs_1.default.hashSync(password, salt);
        yield User_1.UserModel.save(username, hashedPassword, salt, firstname, lastname).catch((error) => {
            throw error;
        });
        res.send({ message: "New account created." });
    }
    catch (error) {
        res.send({
            message: "Cannot create new account. Try again later.",
        });
    }
}));
exports.authRouter.post("/login", validateUsername_1.validateUsername, validatePassword_1.validatePassword, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield User_1.UserModel.find(username);
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
        res.json({ message: "Logged successfully." });
    }
    catch (error) {
        console.log(error);
        res.json({ message: "Cannot log in. Try again later." });
    }
}));
