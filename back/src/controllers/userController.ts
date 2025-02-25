import { Request, Response } from 'express';
import { db } from '../db/dbOperations';
import { User } from '../models/user';
import admin from '../configs/firebase';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';

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
            await admin.auth().createUser({   // Don't wait for the promise to resolve to send the response for better performance
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

    async confirmEmail(req: Request, res: Response) {
        try {
            const email = req.body.email;

            const user = await db.collection<User>('users').findOne({ email });

            if (!user) {
                return res.status(404).send('User not found');
            }

            if (user.emailVerified) {
                return res.status(200).send('Email already verified');
            }

            await db.collection<User>('users').updateOne(
                { email },
                { $set: { emailVerified: true, updatedAt: new Date() } }
            );

            res.status(200).send('Email confirmed');
        } catch (error) {
            console.error("Error confirming email:", error);
            res.status(500).send('Internal Server Error');
        }
    }

    async getUser(req: Request, res: Response) {
        const userId = req.user._id;

        type UserResponse = {
            username: string;
            email: string;
            admin: boolean;
            poolNumber: number;
        }

        try {
            const user = await db.collection<User>('users').findOne({
                _id: ObjectId.createFromHexString(userId)
            });

            if (!user) {
                return res.status(404).send('User not found');
            }

            const response: UserResponse = {
                username: user.username,
                email: user.email,
                admin: user.admin,
                poolNumber: user.pools?.length || 0
            };

            res.status(200).send(response);
        } catch (error) {
            console.error("Error getting user:", error);
            res.status(500).send('Internal Server Error');
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const userId = req.user._id;
            const { username } = req.body;
    
            const updates: Partial<User> = {};
            const firebaseUpdates: any = {};
    
            // Update username
            if (username) {
                const existingUser = await db.collection<User>('users').findOne({ username });
                if (existingUser && existingUser._id.toString() !== userId) {
                    return res.status(400).send('Username already taken');
                }
                updates.username = username;
                firebaseUpdates.displayName = username;
            }
    
            if (Object.keys(updates).length === 0) {
                return res.status(400).send('No fields to update');
            }
    
            updates.updatedAt = new Date();
    
            // Update MongoDB
            await db.collection<User>('users').updateOne(
                { _id: ObjectId.createFromHexString(userId) },
                { $set: updates }
            );
    
            // Update Firebase
            const user = await db.collection<User>('users').findOne({ 
                _id: ObjectId.createFromHexString(userId) 
            });
            
            if (user) {
                const firebaseUser = await admin.auth().getUserByEmail(user.email);
                await admin.auth().updateUser(firebaseUser.uid, firebaseUpdates);
            }
    
            res.status(200).send('User updated successfully');
        } catch (error) {
            console.error("Error updating user:", error);
            res.status(500).send('Internal Server Error');
        }
    }

    async resetPassword(req: Request, res: Response) {
        const { email, newPassword } = req.body;

        try {
            const user = await db.collection<User>('users').findOne({
                email
            });

            if (!user) {
                return res.status(404).send('User not found');
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await db.collection<User>('users').updateOne({
                email
            }, {
                $set: {
                    password: hashedPassword
                }
            });

            try {
                const firebaseUser = await admin.auth().getUserByEmail(email);
                await admin.auth().updateUser(firebaseUser.uid, {
                    password: newPassword
                });
            } catch (firebaseError) {
                console.error('Error updating Firebase user:', firebaseError);
                return res.status(500).send('Internal Server Error');
            }

            res.status(200).send('Password updated');
        } catch (error) {
            console.error("Error resetting password:", error);
            res.status(500).send('Internal Server Error');
        }
    }
}

export default new UserController();