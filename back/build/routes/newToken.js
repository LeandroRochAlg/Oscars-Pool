"use strict";
// src/routes/newToken.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const dbOperations_1 = require("../db/dbOperations");
const router = express_1.default.Router();
// Generates and saves a new token into the database
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isAdmin = req.body.isAdmin || false; // If isAdmin is not provided, it defaults to false
        const token = (0, uuid_1.v4)();
        const newToken = {
            token,
            isAdmin,
            isUsed: false
        };
        yield dbOperations_1.db.collection('tokens').insertOne(newToken);
        res.status(201).send(token);
    }
    catch (error) {
        res.status(500).send('Internal Server Error');
    }
}));
exports.default = router;
