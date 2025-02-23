import { Request, Response } from 'express';
import NomineeService from '../services/nomineeService';
import { Category } from '../models/category';
import { Nominee } from '../models/nominee';
import { db } from '../db/dbOperations';

class NomineeController {
    async getCategories(_req: Request, res: Response) {
        try {
            // Get only the categories names from the json file
            const nominees = await NomineeService.getNominees();

            const categories: string[] = [];

            nominees.map((category: Category) => {
                categories.push(category.category);
            });

            res.status(200).json(categories);
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }

    async getNominees(req: Request, res: Response) {
        try {
            const { category } = req.params;
            
            const nominees = await NomineeService.getNominees();

            const categoryData = nominees.find((categoryData: Category) => categoryData.category === category);

            if (!categoryData) {
                res.status(404).send('Category not found');
                return;
            }

            const categoryWinner = await db.collection('winners').findOne({ category });

            const nomineesData = categoryData.nominees.map((nominee: Nominee) => {
                const isWinner = categoryWinner?.nominee === nominee.name;
                return { ...nominee, isWinner };
            });

            res.status(200).json(nomineesData);
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }

    async registerWinner(req: Request, res: Response) {
        type Winner = {
            category: string;
            nominee: string;
        }

        const { category, nominee } = req.body as Winner;

        try {
            const winners = db.collection('winners');

            const existingCategory = await winners.findOne({ category });

            if (existingCategory) {
                await winners.updateOne({ category }, { $set: { nominee } });
                return res.status(200).send('Winner updated');
            }

            const winner = { category, nominee };

            await winners.insertOne(winner);

            res.status(200).send('Winner registered');
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }
}

export default new NomineeController();