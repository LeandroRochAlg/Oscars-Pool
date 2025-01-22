import { Request, Response } from 'express';
import { db } from '../db/dbOperations';
import { User } from '../models/user';
import admin from '../configs/firebase';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class UserController {
    async register(req: Request, res: Response) {
        try {
            type UserRegister = Pick<User, 'username' | 'email' | 'password' | 'googleId'>;

            const user: UserRegister = req.body;

            const { username, email, password } = user;
    
            // Check if the username or email are already taken
            const existingUser = await db.collection<User>('users').findOne({
                $or: [
                    { username },
                    { email }
                ]
            });
    
            if (existingUser) {
                return res.status(400).send('Username or email already taken');
            }
    
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;

            const emailVerified = user.googleId ? true : false;

            const newUser: User = {
                ...user,
                admin: false,
                emailVerified,
                createdAt: new Date(),
                updatedAt: new Date()
            };
    
            // Insert the new user into the database
            await db.collection<User>('users').insertOne(newUser);

            // Insert the new user into Firebase Authentication
            admin.auth().createUser({   // Don't wait for the promise to resolve to send the response for better performance
                email,
                emailVerified,
                password,
                displayName: username
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

    async changeUsername(req: Request, res: Response) {
        const username = req.user.username;
        const newUsername = req.body.username;

        console.log('Changing username:', username, 'to', newUsername);

        try {
            const existingUser = await db.collection<User>('users').findOne({
                username: newUsername
            });

            if (existingUser) {
                return res.status(400).send('Username already taken');
            }

            await db.collection<User>('users').updateOne({
                username
            }, {
                $set: {
                    username: newUsername
                }
            });

            const newToken = jwt.sign({ username: newUsername, admin: req.user.admin }, process.env.JWT_SECRET || '', { expiresIn: '1h' });

            res.status(200).send(newToken);
        } catch (error) {
            console.error("Error changing username:", error);
            res.status(500).send('Internal Server Error');
        }
    }

    async changePassword(req: Request, res: Response) {
        const username = req.user.username;
        const password = req.body.password;

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            await db.collection<User>('users').updateOne({
                username
            }, {
                $set: {
                    password: hashedPassword
                }
            });

            res.status(200).send('Password updated');
        } catch (error) {
            console.error("Error changing password:", error);
            res.status(500).send('Internal Server Error');
        }
    }
}

export default new UserController();