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
exports.declineFriendRequest = exports.acceptFriendRequest = exports.sendFriendRequest = exports.getRequests = exports.getContacts = void 0;
const Contact_1 = require("../models/Contact");
const contactStatus_1 = require("../ts/enums/contactStatus");
const getContacts = (socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = socket.request.session;
        const contacts = yield Contact_1.ContactsModel.findAll(session.userId);
        contacts.forEach((contact) => {
            const contactIds = [session.userId, contact.id].sort();
            socket.join(`chat-${contactIds[0]}-${contactIds[1]}`);
        });
        socket.emit("get_contacts", contacts);
    }
    catch (error) {
        console.log(error);
        socket.emit("error", { message: "Cannot get contacts." });
    }
});
exports.getContacts = getContacts;
const getRequests = (socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = socket.request.session;
        const requests = yield Contact_1.ContactsModel.findAllRequests(session.userId);
        socket.emit("get_requests", requests);
    }
    catch (error) {
        console.log(error);
        socket.emit("error", { message: "Cannot get friend requests." });
    }
});
exports.getRequests = getRequests;
const sendFriendRequest = (socket, friendId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = socket.request.session;
        const areContacts = yield Contact_1.ContactsModel.areContacts(session.userId, friendId);
        if (areContacts)
            return;
        yield Contact_1.ContactsModel.save(session.userId, friendId, contactStatus_1.ContactStatus.PENDING);
    }
    catch (error) {
        console.log(error);
        socket.emit("error", { message: "Cannot send friend request." });
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
        socket.emit("error", { message: "Cannot accept request." });
    }
});
exports.acceptFriendRequest = acceptFriendRequest;
const declineFriendRequest = (socket, friendId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = socket.request.session;
        yield Contact_1.ContactsModel.save(friendId, session.userId, contactStatus_1.ContactStatus.DECLINED);
    }
    catch (error) {
        console.log(error);
        socket.emit("error", { message: "Cannot decline request." });
    }
});
exports.declineFriendRequest = declineFriendRequest;
