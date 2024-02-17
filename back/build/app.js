"use strict";
// src/app.ts
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
const dbOperations_1 = require("./db/dbOperations");
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = require("./routes/index");
dotenv_1.default.config();
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(index_1.routes);
// Open the server on the specified port
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, dbOperations_1.connectDatabase)(process.env.MONGODB_URI || '');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
    catch (error) {
        console.error('Error connecting to the database', error);
    }
}))();
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.send('Hello World!');
    }
    catch (error) {
        res.status(500).send('Internal Server Error');
    }
}));
