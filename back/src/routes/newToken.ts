// src/routes/newToken.ts

import express, { Request, Response } from 'express';
import { generateToken } from '../db/dbOperations';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    try {
        const isAdmin = req.body.isAdmin || false; // Default to false if not provided
        const token = await generateToken(isAdmin);
        res.status(201).json({ token });
    } catch (error) {
        console.error("Error generating token:", error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;
