"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePasswordMiddleware = void 0;
// Промежуточный обработчик, валидирующий пароль
function validatePasswordMiddleware(req, res, next) {
    const { password } = req.body;
    const passwordRegEx = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,255}$/;
    if (!passwordRegEx.test(password))
        return res.status(400).json({
            message: "Invalid password format.",
        });
    next();
}
exports.validatePasswordMiddleware = validatePasswordMiddleware;
