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
exports.acceptFriendRequest = exports.sendFriendRequest = exports.getContacts = void 0;
const Contact_1 = require("../models/Contact");
const contactStatus_1 = require("../ts/enums/contactStatus");
const getContacts = (socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = socket.request.session;
        const contacts = yield Contact_1.ContactsModel.findAll(session.userId);
        socket.emit("get_contacts", contacts);
    }
    catch (error) {
        console.log(error);
    }
});
exports.getContacts = getContacts;
const sendFriendRequest = (socket, friendId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = socket.request.session;
        yield Contact_1.ContactsModel.save(session.userId, friendId, contactStatus_1.ContactStatus.PENDING);
    }
    catch (error) {
        console.log(error);
    }
});
exports.sendFriendRequest = sendFriendRequest;
const acceptFriendRequest = (socket, friendId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = socket.request.session;
        yield Contact_1.ContactsModel.save(session.userId, friendId, contactStatus_1.ContactStatus.ACCEPTED);
    }
    catch (error) {
        console.log(error);
    }
});
exports.acceptFriendRequest = acceptFriendRequest;
