import { ObjectId } from "mongodb";

export interface User {
    _id?: ObjectId;
    googleId?: string;
    username: string;
    email: string;
    password: string;
    admin: boolean;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}