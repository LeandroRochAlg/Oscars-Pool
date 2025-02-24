import express from 'express';
import BetController from '../controllers/betController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const betRouter = express.Router();

// Create or update bets
betRouter.put('/create/:poolId', authMiddleware, BetController.createBet);

// Get bets
betRouter.get('/:poolId', authMiddleware, BetController.getBets);