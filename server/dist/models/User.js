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
exports.UserModel = void 0;
const DatabaseManager_1 = require("../database/DatabaseManager");
class UserModel {
    static save(username, password, firstname, lastname) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DatabaseManager_1.DatabaseManager.executeQuery(`INSERT INTO users VALUES (DEFAULT, "${username}", "${password}", "${firstname}", "${lastname}", DEFAULT, DEFAULT, DEFAULT)`);
        });
    }
    static findUser(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield DatabaseManager_1.DatabaseManager.executeQuery(`SELECT * FROM users WHERE username = "${username}"`);
            return user[0];
        });
    }
}
exports.UserModel = UserModel;
