"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNameMiddleware = void 0;
// Промежуточный обработчик, валидирующий имя и фамилию
function validateNameMiddleware(req, res, next) {
    const { firstname, lastname } = req.body;
    if (!(firstname.length > 0 && firstname.length < 255))
        return res.status(400).json({
            message: "Firstname length must be between 1 - 255 characters",
        });
    if (!(lastname.length > 0 && lastname.length < 255))
        return res.status(400).json({
            message: "Lastname length must be between 1 - 255 characters",
        });
    next();
}
exports.validateNameMiddleware = validateNameMiddleware;
