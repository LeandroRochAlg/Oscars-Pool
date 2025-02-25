import { User } from "../models/user";
import jwt from "jsonwebtoken";

type UserToken = Pick<User, 'username' | 'email' | 'admin' | 'emailVerified'>;
type UserPayload = UserToken & { token: string };

class UserService {
    async getUserPayload(user: User): Promise<UserPayload> {
        const userToken: UserToken = {
            username: user.username,
            email: user.email,
            admin: user.admin,
            emailVerified: user.emailVerified
        };

        const token = jwt.sign({_id: user._id, ...userToken}, process.env.JWT_SECRET || '', { expiresIn: '7d' });

        const userPayload: UserPayload = {
            ...userToken,
            token
        };

        return userPayload;
    }
}

export default new UserService();