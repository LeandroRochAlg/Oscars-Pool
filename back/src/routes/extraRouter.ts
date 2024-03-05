// src/routes/extraRouter.ts

import express from 'express';
import ExtraController from '../controllers/extraController';
import { adminMiddleware } from '../middlewares/adminMiddleware';

export const extraRouter = express.Router();

// New Invite Token
extraRouter.post('/newToken', adminMiddleware, ExtraController.newToken);