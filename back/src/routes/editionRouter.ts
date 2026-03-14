import express from 'express';
import EditionController from '../controllers/editionController';
import { adminMiddleware } from '../middlewares/adminMiddleware';

export const editionRouter = express.Router();

editionRouter.get('/', EditionController.listEditions);
editionRouter.get('/active', EditionController.getActiveEdition);
editionRouter.put('/:key/activate', adminMiddleware, EditionController.activateEdition);
