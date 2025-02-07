import express from 'express';
import NomineeController from '../controllers/nomineeController';

export const nomineeRouter = express.Router();

// Get categories
nomineeRouter.get('/categories', NomineeController.getCategories);

// Get nominees from a category
nomineeRouter.get('/nominees/:category', NomineeController.getNominees);