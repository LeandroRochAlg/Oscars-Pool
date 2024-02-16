"use strict";
// src/db/dbOperations.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = exports.db = void 0;
const mongodb_1 = require("mongodb");
// Connects to the database and returns the connected database instance
const connectDatabase = (uri) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = new mongodb_1.MongoClient(uri);
        yield client.connect();
        console.log("Connected to the database");
        exports.db = client.db("pool"); // Connects to the pool database
    }
    catch (error) {
        console.error("Error connecting to the database", error);
        throw error; // Throws the error to be handled at the higher level
    }
});
exports.connectDatabase = connectDatabase;
