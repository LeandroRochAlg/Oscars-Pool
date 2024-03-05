// src/controller/userController.ts

import { Request, Response } from 'express';
import { db } from '../db/dbOperations';
import { User } from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class UserController {
    async register(req: Request, res: Response) {
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
    }

    async admin(req: Request, res: Response) {
        const isAdmin = req.user.admin;

        res.status(200).send({isAdmin});
    }

    async username(req: Request, res: Response) {
        const username = req.user.username;

        res.status(200).send({username});
    }

    async getUser(req: Request, res: Response) {
        const username = req.user.username;

        interface UserResponse {
            username: string;
            admin: boolean;
            betNumber: number;
        }

        try {
            const user = await db.collection<User>('users').findOne({
                username
            });

            if (!user) {
                return res.status(404).send('User not found');
            }

            const userId = user._id;

            const betNumber = await db.collection('bets').countDocuments({
                userId
            });

            const response: UserResponse = {
                username: user.username,
                admin: user.admin,
                betNumber
            };

            res.status(200).send(response);
        } catch (error) {
            console.error("Error getting user:", error);
            res.status(500).send('Internal Server Error');
        }
    }
}

export default new UserController();