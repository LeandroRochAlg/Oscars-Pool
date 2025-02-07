// stc/routes/index.ts

import express from 'express';
import { userRouter } from './userRouter';
import { betRouter } from './betRouter';
import { extraRouter } from './extraRouter';
import { nomineeRouter } from './nomineeRouter';

export const routes = express.Router();

routes.use(userRouter);
routes.use(betRouter);
routes.use(extraRouter);
routes.use(nomineeRouter);