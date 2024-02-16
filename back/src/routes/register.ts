// src/routes/register.ts

import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { db } from '../db/dbOperations';
import { User } from '../models/user';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const token = req.body.token;
        let admin = false;

        // Check the token
        const tokenDoc = await db.collection('tokens').findOne({
            token
        });

        if (!tokenDoc) {
            return res.status(401).send('Invalid token');
        }else if (tokenDoc.isUsed) {
            return res.status(401).send('Token already used');
        }else if (tokenDoc.isAdmin) {
            admin = true;
        }

        // Check if the username is already taken
        const existingUser = await db.collection<User>('users').findOne({
            username
        });

        if (existingUser) {
            return res.status(400).send('Username already taken');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser: User = {
            username,
            password: hashedPassword,
            admin: admin
        };

        await db.collection<User>('users').insertOne(newUser);

        // Mark the token as used
        await db.collection('tokens').updateOne({
            token
        }, {
            $set: {
                isUsed: true
            }
        });

        res.status(201).send('User registered');
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;