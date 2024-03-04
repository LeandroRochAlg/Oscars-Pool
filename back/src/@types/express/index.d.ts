// src/@types/express/index.d.ts

import { User } from "../models/user";

// Add the user property to the Request interface
declare module 'express-serve-static-core' {
    interface Request {
        user?: User | jwt.JwtPayload;
    }
}