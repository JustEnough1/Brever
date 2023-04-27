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
exports.ContactsModel = void 0;
const DatabaseManager_1 = require("../database/DatabaseManager");
const contactStatus_1 = require("../ts/enums/contactStatus");
class ContactsModel {
    static save(userId, friendId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = "";
                switch (status) {
                    case contactStatus_1.ContactStatus.PENDING:
                        query = `INSERT INTO contacts (user_id, friend_id) VALUES (${userId}, ${friendId})`;
                        break;
                    case contactStatus_1.ContactStatus.ACCEPTED:
                        query = `INSERT INTO contacts (user_id, friend_id, status) VALUES (${userId}, ${friendId}, '${status}'), (${friendId}, ${userId}, '${status}') ON DUPLICATE KEY UPDATE status = VALUES(status);`;
                        break;
                    default:
                        break;
                }
                return yield DatabaseManager_1.DatabaseManager.executeQuery(query);
            }
            catch (error) {
                console.log(error);
                return new Error("Error");
            }
        });
    }
    static findAll(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DatabaseManager_1.DatabaseManager.executeQuery(`
            SELECT users.id, users.first_name, users.last_name, users.avatar
            FROM contacts
            INNER JOIN users ON friend_id = users.id
            WHERE user_id = ${userId} AND status = '${contactStatus_1.ContactStatus.ACCEPTED}'
            `);
        });
    }
}
exports.ContactsModel = ContactsModel;
