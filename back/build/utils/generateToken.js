"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const uuid_1 = require("uuid");
const generateToken = (isAdmin) => {
    const token = (0, uuid_1.v4)();
    console.log('Token generated: ', token);
    return token;
};
exports.generateToken = generateToken;
