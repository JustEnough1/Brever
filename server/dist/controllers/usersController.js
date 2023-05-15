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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.searchUser = exports.updateUser = void 0;
const User_1 = require("../models/User");
const server_1 = require("../server");
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = req.session;
        (0, server_1.upload)(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res
                    .status(500)
                    .json({ message: "Error uploading file" });
            }
            const { username, password, first_name, last_name } = req.body;
            const avatar = req.file ? req.file.filename : undefined;
            yield User_1.UserModel.update(session.userId, {
                username,
                password,
                first_name,
                last_name,
                avatar,
            });
            const profile = User_1.UserModel.getProfileFromUser(yield User_1.UserModel.findById(req.session.userId));
            res.json(profile);
        }));
    }
    catch (error) {
        res.status(500).json({ message: "Cannot update user." });
    }
});
exports.updateUser = updateUser;
const searchUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { searchValue } = req.query;
        if (!searchValue)
            return res
                .status(400)
                .json({ message: "Please, provide search value." });
        const matchedUsers = yield User_1.UserModel.findBySearchValue(searchValue, req.session.userId);
        res.json({ matchedUsers });
    }
    catch (error) {
        res.status(500).json({ error: "Error occured." });
    }
});
exports.searchUser = searchUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield User_1.UserModel.delete(req.session.userId);
        res.clearCookie("connect.sid", { path: "/" });
        res.json({ message: "User has been deleted." });
    }
    catch (error) {
        res.status(500).json({ error: "Error occured." });
    }
});
exports.deleteUser = deleteUser;
