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
exports.checkSocketSessionMiddleware = exports.checkSessionMiddleware = void 0;
function checkSessionMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const session = req.session;
            if (!session.userId) {
                return res.status(400).json({ message: "Unauthorized" });
            }
            next();
        }
        catch (error) {
            return res.status(500);
        }
    });
}
exports.checkSessionMiddleware = checkSessionMiddleware;
function checkSocketSessionMiddleware(socket, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const session = socket.request.session;
            if (!session.userId) {
                return socket.emit("error", { message: "Unauthorized" });
            }
            next();
        }
        catch (error) {
            return socket.emit("error", { message: "Error" });
        }
    });
}
exports.checkSocketSessionMiddleware = checkSocketSessionMiddleware;
