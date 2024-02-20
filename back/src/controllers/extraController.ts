// src/controllers/extraController.ts

import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Token } from '../models/token';
import { db } from '../db/dbOperations';

class ExtraController {
    async newToken(req: Request, res: Response) {
        try {
            const isAdmin = req.body.isAdmin || false;  // If isAdmin is not provided, it defaults to false
            const token = uuidv4();

            const newToken: Token = {
                token,
                isAdmin,
                isUsed: false
            };

            await db.collection<Token>('tokens').insertOne(newToken);

            res.status(201).send(token);
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }
};

export default new ExtraController();