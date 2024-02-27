// src/middlewares/authMiddleware.ts

import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = async (req: Request, res: Response, next: any) => {
    const authorization = req.header("authorization");

    if (!authorization) {
        return res.status(401).send("Access Denied");
    }

    const token = authorization.split(" ")[1];

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || "");
        req.user = verified;

        console.log(verified);

        next();
    } catch (err) {
        res.status(400).send("Invalid Token");
    }
};