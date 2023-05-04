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
exports.Message = void 0;
const DatabaseManager_1 = require("../database/DatabaseManager");
const Contact_1 = require("./Contact");
class Message {
    static save(senderId, receiverId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const areContacts = yield Contact_1.ContactsModel.areContacts(senderId, receiverId);
            if (!areContacts)
                throw new Error("Sender and receiver aren't contacts");
            const result = yield DatabaseManager_1.DatabaseManager.executeQuery(`INSERT INTO messages (sender_id, receiver_id, message) VALUES (${senderId}, ${receiverId},'${message}')`);
            return yield DatabaseManager_1.DatabaseManager.executeQuery(`SELECT * FROM messages WHERE id = ${result.insertId}`);
        });
    }
}
exports.Message = Message;
