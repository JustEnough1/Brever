"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findActiveSockets = exports.addActiveSockets = void 0;
let activeSockets = [];
function addActiveSockets(userId, socketId) {
    const userSockets = findActiveSockets(userId);
    if (userSockets) {
        userSockets.push(socketId);
        return;
    }
    activeSockets.push({
        userId: userId,
        sockets: [socketId],
    });
}
exports.addActiveSockets = addActiveSockets;
function findActiveSockets(userId) {
    const result = activeSockets.filter((connection) => connection.userId === userId)[0];
    return result ? result.sockets : [];
}
exports.findActiveSockets = findActiveSockets;
