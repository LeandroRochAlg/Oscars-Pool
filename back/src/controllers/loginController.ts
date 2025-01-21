import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { db } from '../db/dbOperations';
import { User } from '../models/user';

class LoginController {
    async login(req: Request, res: Response) {
        try {
            type UserLogin = Pick<User, 'password'> & { emailOrUsername: string };
            type UserToken = Pick<User, 'username' | 'email' | 'admin' | 'emailVerified'>;
            type UserPayload = UserToken & { token: string };

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

            const userToken: UserToken = {
                username: user.username,
                email: user.email,
                admin: user.admin,
                emailVerified: user.emailVerified
            };

            const token = jwt.sign(userToken, process.env.JWT_SECRET || '', { expiresIn: '7d' });

            console.log('User logged in at:', new Date().toLocaleString());

            const userPayload: UserPayload = {
                ...userToken,
                token
            };

            res.status(200).send(userPayload);
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }
}

export default new LoginController();