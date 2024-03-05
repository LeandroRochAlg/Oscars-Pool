// src/routes/userRouter.ts

import express from 'express';
import LoginController from '../controllers/loginController';
import userController from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const userRouter = express.Router();

// Login
userRouter.post('/login', LoginController.login);

// Register
userRouter.post('/register', userController.register);

// Admin check 
userRouter.get('/admin', authMiddleware, userController.admin);

// Get username
userRouter.get('/username', authMiddleware, userController.username);

// Get user
userRouter.get('/user', authMiddleware, userController.getUser);