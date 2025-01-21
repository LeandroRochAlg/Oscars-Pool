import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { db } from '../db/dbOperations';
import { User } from '../models/user';
import UserService from '../services/userService';

class LoginController {
    async login(req: Request, res: Response) {
        try {
            type UserLogin = Pick<User, 'password'> & { emailOrUsername: string };

            const userToLogin: UserLogin = req.body;

            const { emailOrUsername, password } = userToLogin;

            const user = await db.collection<User>('users').findOne({
                $or: [
                    { username: emailOrUsername },
                    { email: emailOrUsername }
                ]
            });

            if (!user) {
                return res.status(401).send('Invalid username or password');
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).send('Invalid username or password');
            }

            const userPayload = await UserService.getUserPayload(user);

            console.log('User logged in at:', new Date().toLocaleString());

            res.status(200).send(userPayload);
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }

    async loginWithGoogle(req: Request, res: Response) {
        try {
            type GoogleUser = Pick<User, 'googleId'>;

            const googleUser: GoogleUser = req.body;

            const user = await db.collection<User>('users').findOne({
                googleId: googleUser.googleId
            });

            if (!user) {
                return res.status(401).send('Invalid user');
            }

            const userPayload = await UserService.getUserPayload(user);

            console.log('User logged in at:', new Date().toLocaleString());

            res.status(200).send(userPayload);
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }
}

export default new LoginController();