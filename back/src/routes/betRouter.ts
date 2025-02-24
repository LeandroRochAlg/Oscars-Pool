import express from 'express';
import BetController from '../controllers/betController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const betRouter = express.Router();

// Get nominees
betRouter.put('/create/:poolId', authMiddleware, BetController.createBet);