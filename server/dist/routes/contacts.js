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
        socket.on("get_contacts", () => __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, checkSession_1.checkSocketSessionMiddleware)(socket, () => {
                    (0, contactsController_1.getContacts)(socket);
                });
            }
            catch (error) {
                socket.emit("error", { message: "Error" });
            }
        }));
        socket.on("send_friend_request", ({ friendId }) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, checkSession_1.checkSocketSessionMiddleware)(socket, () => {
                    (0, contactsController_1.sendFriendRequest)(socket, friendId);
                });
            }
            catch (error) {
                socket.emit("error", { message: "Error" });
            }
        }));
        socket.on("accept_friend_request", ({ friendId }) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, checkSession_1.checkSocketSessionMiddleware)(socket, () => {
                    (0, contactsController_1.acceptFriendRequest)(socket, friendId);
                });
            }
            catch (error) {
                socket.emit("error", { message: "Error" });
            }
        }));
    });
}
exports.default = setupContactsSocketListeners;
