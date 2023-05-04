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
exports.sendMessage = void 0;
const Message_1 = require("../models/Message");
const sendMessage = (socket, io, receiverId, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = socket.request.session;
        const result = yield Message_1.Message.save(session.userId, receiverId, message);
        const contactIds = [session.userId, receiverId].sort();
        io.to(`chat-${contactIds[0]}-${contactIds[1]}`).emit("send_message", result);
    }
    catch (error) {
        console.log(error);
        socket.emit("error", { message: "Error" });
    }
});
exports.sendMessage = sendMessage;
