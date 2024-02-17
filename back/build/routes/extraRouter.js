"use strict";
// src/routes/extraRouter.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extraRouter = void 0;
const express_1 = __importDefault(require("express"));
const extraController_1 = __importDefault(require("../controllers/extraController"));
exports.extraRouter = express_1.default.Router();
// New Invite Token
exports.extraRouter.post('/newToken', extraController_1.default.newToken);
