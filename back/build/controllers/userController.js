"use strict";
// src/controller/userController.ts
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
const dbOperations_1 = require("../db/dbOperations");
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class UserController {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const username = req.body.username;
                const password = req.body.password;
                const token = req.body.token;
                let admin = false;
                // Check the token
                const tokenDoc = yield dbOperations_1.db.collection('tokens').findOne({
                    token
                });
                if (!tokenDoc) {
                    return res.status(401).send('Invalid token');
                }
                else if (tokenDoc.isUsed) {
                    return res.status(401).send('Token already used');
                }
                else if (tokenDoc.isAdmin) {
                    admin = true;
                }
                // Check if the username is already taken
                const existingUser = yield dbOperations_1.db.collection('users').findOne({
                    username
                });
                if (existingUser) {
                    return res.status(400).send('Username already taken');
                }
                // Hash the password
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const newUser = {
                    username,
                    password: hashedPassword,
                    admin: admin
                };
                yield dbOperations_1.db.collection('users').insertOne(newUser);
                // Mark the token as used
                yield dbOperations_1.db.collection('tokens').updateOne({
                    token
                }, {
                    $set: {
                        isUsed: true
                    }
                });
                res.status(201).send('User registered');
            }
            catch (error) {
                console.error("Error registering user:", error);
                res.status(500).send('Internal Server Error');
            }
        });
    }
}
exports.default = new UserController();
