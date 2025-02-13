import express from "express";
import PoolController from "../controllers/poolController";
import { authMiddleware } from '../middlewares/authMiddleware';

export const poolRouter = express.Router();

// Create a pool
poolRouter.post('/createPool', authMiddleware, PoolController.createPool);

// Get pools info ordered by number of users in the pool
poolRouter.get('/getPoolsByUserNumber', authMiddleware, PoolController.getPoolsByUserNumber);

// Get pools by user
poolRouter.get('/getPoolsByUser', authMiddleware, PoolController.getPoolsByUser);

// Get pools by search
poolRouter.get('/getPoolsBySearch', authMiddleware, PoolController.getPoolsBySearch);

// Get pool by token
poolRouter.get('/getPoolByToken/:token', authMiddleware, PoolController.getPoolByToken);

// Get pool info
poolRouter.get('/getPoolInfo/:poolId', authMiddleware, PoolController.getPoolInfo);

// Get pool leaderboard
poolRouter.get('/getPoolLeaderboard/:poolId', authMiddleware, PoolController.getPoolLeaderboard);

// Join a pool
poolRouter.post('/joinPool', authMiddleware, PoolController.joinPool);

// Leave a pool
poolRouter.post('/leavePool/:poolId', authMiddleware, PoolController.leavePool);

// Add an admin
poolRouter.post('/addAdmin', authMiddleware, PoolController.addAdmin);

// Remove an admin
poolRouter.post('/removeAdmin', authMiddleware, PoolController.removeAdmin);

// Ban a user
poolRouter.post('/banUser', authMiddleware, PoolController.banUser);