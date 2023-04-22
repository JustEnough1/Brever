"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUsernameMiddleware = void 0;
function validateUsernameMiddleware(req, res, next) {
    const { username } = req.body;
    if (!(username.length > 0 && username.length < 50))
        return res.status(400).json({
            message: "Username length must be between 1 - 50 characters",
        });
    next();
}
exports.validateUsernameMiddleware = validateUsernameMiddleware;
