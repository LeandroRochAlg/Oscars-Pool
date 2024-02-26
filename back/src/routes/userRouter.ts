// src/routes/userRouter.ts

import express, { Request, Response } from 'express';
import LoginController from '../controllers/loginController';
import userController from '../controllers/userController';

export const userRouter = express.Router();

// Login
userRouter.post('/login', LoginController.login);

// Register
userRouter.post('/register', userController.register);