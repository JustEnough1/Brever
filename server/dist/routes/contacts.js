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
const contactsController_1 = require("../controllers/contactsController");
const checkSession_1 = require("../middlewares/checkSession");
function setupContactsSocketListeners(io) {
    io.on("connection", (socket) => {
        try {
            socket.on("get_contacts", () => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield (0, checkSession_1.checkSocketSessionMiddleware)(socket, () => {
                        (0, contactsController_1.getContacts)(socket);
                    });
                }
                catch (error) {
                    socket.emit("error", { error: "Error" });
                }
            }));
            socket.on("get_requests", () => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield (0, checkSession_1.checkSocketSessionMiddleware)(socket, () => {
                        (0, contactsController_1.getRequests)(socket);
                    });
                }
                catch (error) {
                    socket.emit("error", { error: "Error" });
                }
            }));
            socket.on("send_friend_request", (payload) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield (0, checkSession_1.checkSocketSessionMiddleware)(socket, () => {
                        if (payload.friendId)
                            (0, contactsController_1.sendFriendRequest)(socket, payload.friendId);
                    });
                }
                catch (error) {
                    socket.emit("error", { message: "Error" });
                }
            }));
            socket.on("accept_friend_request", (payload) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield (0, checkSession_1.checkSocketSessionMiddleware)(socket, () => {
                        if (payload.friendId)
                            (0, contactsController_1.acceptFriendRequest)(socket, payload.friendId);
                        else {
                            throw new Error("Please provide payload.");
                        }
                    });
                }
                catch (error) {
                    socket.emit("error", { message: error });
                }
            }));
            socket.on("decline_friend_request", (payload) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield (0, checkSession_1.checkSocketSessionMiddleware)(socket, () => {
                        if (payload.friendId)
                            (0, contactsController_1.declineFriendRequest)(socket, payload.friendId);
                        else {
                            throw new Error("Please provide payload.");
                        }
                    });
                }
                catch (error) {
                    socket.emit("error", { message: error });
                }
            }));
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.default = setupContactsSocketListeners;
