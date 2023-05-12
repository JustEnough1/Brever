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
exports.UserModel = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const DatabaseManager_1 = require("../database/DatabaseManager");
class UserModel {
    static hashPassword(password) {
        const salt = bcryptjs_1.default.genSaltSync(10);
        const hashedPassword = bcryptjs_1.default.hashSync(password, salt);
        return { hashedPassword, salt };
    }
    static save(username, password, salt, firstname, lastname) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DatabaseManager_1.DatabaseManager.executeQuery(`INSERT INTO users VALUES (DEFAULT, "${username}", "${password}", "${salt}", "${firstname}", "${lastname}", DEFAULT, DEFAULT, DEFAULT)`);
        });
    }
    static findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield DatabaseManager_1.DatabaseManager.executeQuery(`SELECT * FROM users WHERE username = "${username}"`);
            return user[0];
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield DatabaseManager_1.DatabaseManager.executeQuery(`SELECT * FROM users WHERE id = ${id}`);
            return user[0];
        });
    }
    static findBySearchValue(searchValue, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let users = yield DatabaseManager_1.DatabaseManager.executeQuery(`SELECT *
            FROM users
            WHERE username LIKE '%${searchValue}%'
            AND id != ${userId}
            AND id NOT IN (
                SELECT friend_id
                FROM contacts
                WHERE user_id = ${userId}
            );
            `);
            users = users.map((user) => {
                return UserModel.getProfileFromUser(user);
            });
            return users;
        });
    }
    static getProfileFromUser(user) {
        return {
            id: user.id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            avatar: user.avatar,
        };
    }
    static update(userId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = `UPDATE users SET `;
            if (user.username) {
                query += ` username = '${user.username}',`;
            }
            if (user.password) {
                const { hashedPassword, salt } = UserModel.hashPassword(user.password);
                query += ` password = '${hashedPassword}', salt = '${salt}',`;
            }
            if (user.first_name) {
                query += ` first_name = '${user.first_name}',`;
            }
            if (user.last_name) {
                query += ` last_name = '${user.last_name}',`;
            }
            if (user.avatar) {
                query += ` avatar = '${user.avatar}',`;
            }
            query = query.slice(0, -1);
            query += `, updated_at = NOW() WHERE id = ${userId}`;
            return yield DatabaseManager_1.DatabaseManager.executeQuery(query);
        });
    }
}
exports.UserModel = UserModel;
