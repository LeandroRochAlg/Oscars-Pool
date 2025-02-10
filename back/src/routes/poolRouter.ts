import express from "express";
import PoolController from "../controllers/poolController";
import { authMiddleware } from '../middlewares/authMiddleware';

export const poolRouter = express.Router();

// Create a pool
poolRouter.post('/createPool', authMiddleware, PoolController.createPool);

// Get pools info ordered by number of users in the pool
poolRouter.get('/getPoolsByUserNumber', authMiddleware, PoolController.getPoolsByUserNumber);