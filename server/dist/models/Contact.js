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
// Класс, отвечающий за работу, связанной с контактами
class ContactsModel {
    // Метод сохранения в базу данных
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
                    case contactStatus_1.ContactStatus.DECLINED:
                        query = `DELETE FROM contacts WHERE user_id = ${userId} AND friend_id = ${friendId} AND status = '${contactStatus_1.ContactStatus.PENDING}'`;
                        break;
                    default:
                        break;
                }
                return yield DatabaseManager_1.DatabaseManager.executeQuery(query);
            }
            catch (error) {
                return error;
            }
        });
    }
    // Метод получения всех контактов пользователя
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
    // Метод получения всех запросов на добавления в контакты
    static findAllRequests(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DatabaseManager_1.DatabaseManager.executeQuery(`
            SELECT users.id, users.first_name, users.last_name, users.avatar
            FROM contacts
            INNER JOIN users ON user_id = users.id
            WHERE friend_id = ${userId} AND status = '${contactStatus_1.ContactStatus.PENDING}'
            `);
        });
    }
    // Метод проверки, являются ли два пользователя контактами
    static areContacts(userId, friendId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield DatabaseManager_1.DatabaseManager.executeQuery(`
            SELECT COUNT(*) as count FROM contacts WHERE (user_id = ${userId} AND friend_id = ${friendId} AND status = '${contactStatus_1.ContactStatus.ACCEPTED}') 
            `);
            return result[0].count > 0 ? true : false;
        });
    }
}
exports.ContactsModel = ContactsModel;
