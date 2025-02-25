// stc/routes/index.ts

import express from 'express';
import { userRouter } from './userRouter';
import { betRouter } from './betRouter';
import { nomineeRouter } from './nomineeRouter';
import { poolRouter } from './poolRouter';

export const routes = express.Router();

routes.use(userRouter);
routes.use('/bet', betRouter);
routes.use(nomineeRouter);
routes.use('/pools', poolRouter);