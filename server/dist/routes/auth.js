"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const validateUsername_1 = require("../middlewares/validateUsername");
const validatePassword_1 = require("../middlewares/validatePassword");
const validateName_1 = require("../middlewares/validateName");
const checkSession_1 = require("../middlewares/checkSession");
const authController_1 = require("../controllers/authController");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/signup", validateUsername_1.validateUsernameMiddleware, validatePassword_1.validatePasswordMiddleware, validateName_1.validateNameMiddleware, authController_1.signup);
exports.authRouter.post("/login", validateUsername_1.validateUsernameMiddleware, validatePassword_1.validatePasswordMiddleware, authController_1.login);
exports.authRouter.post("/logout", checkSession_1.checkSessionMiddleware, authController_1.logout);
exports.authRouter.post("/check-session", checkSession_1.checkSessionMiddleware, authController_1.checkSession);
function setupAuthSocketListeners(io) { }
exports.default = setupAuthSocketListeners;
