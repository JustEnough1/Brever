"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = void 0;
function validatePassword(req, res, next) {
    const { password } = req.body;
    const passwordRegEx = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{1,255}$/;
    if (!passwordRegEx.test(password))
        return res.status(400).json({
            message: "Invalid password format.",
        });
    next();
}
exports.validatePassword = validatePassword;
