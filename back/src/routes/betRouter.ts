// src/routes/betRouter.ts

import express from 'express';
import BetController from '../controllers/betController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { adminMiddleware } from '../middlewares/adminMiddleware';

export const betRouter = express.Router();

// Get nominees
betRouter.get('/nominees', authMiddleware, BetController.getNominees);

// Make a bet
betRouter.post('/bet', authMiddleware, BetController.makeBet);

// Register a winner
betRouter.post('/winner', adminMiddleware, BetController.registerWinner);