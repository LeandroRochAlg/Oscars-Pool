"use strict";
// stc/routes/index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = __importDefault(require("express"));
const userRouter_1 = require("./userRouter");
const betRouter_1 = require("./betRouter");
const extraRouter_1 = require("./extraRouter");
exports.routes = express_1.default.Router();
exports.routes.use(userRouter_1.userRouter);
exports.routes.use(betRouter_1.betRouter);
exports.routes.use(extraRouter_1.extraRouter);
