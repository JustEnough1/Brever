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
exports.updateUser = void 0;
const User_1 = require("../models/User");
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = req.session;
        const { username, password, first_name, last_name, avatar } = req.body;
        yield User_1.UserModel.update(session.userId, {
            username,
            password,
            first_name,
            last_name,
            avatar,
        }).catch((err) => {
            throw err;
        });
        const profile = User_1.UserModel.getProfileFromUser(yield User_1.UserModel.findById(session.userId));
        res.json(profile);
    }
    catch (error) {
        return res.status(500).json({ message: "Cannot update user." });
    }
});
exports.updateUser = updateUser;
