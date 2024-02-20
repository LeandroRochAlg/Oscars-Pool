// src/routes/extraRouter.ts

import express, { Request, Response } from 'express';
import ExtraController from '../controllers/extraController';

export const extraRouter = express.Router();

// New Invite Token
extraRouter.post('/newToken', ExtraController.newToken);