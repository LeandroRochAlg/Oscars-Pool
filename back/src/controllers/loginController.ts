// src/controllers/loginController.ts

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { db } from '../db/dbOperations';
import { User } from '../models/user';
import dotenv from 'dotenv';

dotenv.config();

class LoginController {
    async login(req: Request, res: Response) {
        try {
            const username = req.body.username;
            const password = req.body.password;

            const user = await db.collection<User>('users').findOne({
                username
            });

            if (!user) {
                return res.status(401).send('Invalid username or password');
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).send('Invalid username or password');
            }

            const token = jwt.sign({ username, admin: user.admin }, process.env.JWT_SECRET || '', { expiresIn: '7d' });

            console.log('User logged in at:', new Date().toLocaleString());

            res.status(200).send(token);
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }
}

export default new LoginController();