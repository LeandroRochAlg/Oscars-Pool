// src/routes/userRouter.ts

import express from 'express';
import LoginController from '../controllers/loginController';
import userController from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const userRouter = express.Router();

// Login
userRouter.post('/login', LoginController.login);

// Login with Google
userRouter.post('/login-google', LoginController.loginWithGoogle);

// Register
userRouter.post('/register', userController.register);

// Confirm email
userRouter.patch('/confirm-email', userController.confirmEmail);

// Get user
userRouter.get('/user', authMiddleware, userController.getUser);

// Reset password
userRouter.put('/reset-password', userController.resetPassword);