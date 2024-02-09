"use strict";
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
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const uri = process.env.MONGODB_URI || '';
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
const connectDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = new mongodb_1.MongoClient(uri);
        yield client.connect();
        console.log("Connected to the database");
        return client.db(); // Returns the connected database instance
    }
    catch (error) {
        console.error("Error connecting to the database", error);
        throw error; // Throws the error to be handled at the higher level
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectDatabase(); // Connects to the database when the server starts
        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    }
    catch (error) {
        console.error("Error starting the server", error);
        process.exit(1); // Exits the process if there is an error starting the server
    }
}))();
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Here you can use the database connection to perform operations
        res.send('Hello World!');
    }
    catch (error) {
        res.status(500).send('Internal Server Error');
    }
}));
