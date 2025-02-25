export interface User {
    _id?: string;
    googleId?: string;
    username: string;
    email: string;
    password: string;
    admin: boolean;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}