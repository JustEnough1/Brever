"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = require("express");
const checkSession_1 = require("../middlewares/checkSession");
const usersController_1 = require("../controllers/usersController");
exports.usersRouter = (0, express_1.Router)();
exports.usersRouter.get("/", checkSession_1.checkSessionMiddleware, usersController_1.searchUser);
exports.usersRouter.put("/", checkSession_1.checkSessionMiddleware, usersController_1.updateUser);
