"use strict";
// src/routes/userRouter.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const loginController_1 = __importDefault(require("../controllers/loginController"));
const userController_1 = __importDefault(require("../controllers/userController"));
exports.userRouter = express_1.default.Router();
// Login
exports.userRouter.post('/login', loginController_1.default.login);
// Register
exports.userRouter.post('/register', userController_1.default.register);
