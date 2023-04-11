"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUsername = void 0;
function validateUsername(req, res, next) {
    const { username } = req.body;
    if (!(username.length > 0 && username.length < 50))
        return res.status(400).json({
            message: "Username length must be between 1 - 50 characters",
        });
    next();
}
exports.validateUsername = validateUsername;
