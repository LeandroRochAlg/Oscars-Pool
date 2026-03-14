import { Request, Response } from 'express';
import NomineeService from '../services/nomineeService';
import { Category } from '../models/category';
import { Nominee } from '../models/nominee';
import EditionService from '../services/editionService';

class NomineeController {
    async getCategories(req: Request, res: Response) {
        try {
            const editionKey = req.query.edition as string | undefined;
            // Get only the categories names from the json file
            const nominees = await NomineeService.getNominees(editionKey);

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
            const editionKey = req.query.edition as string | undefined;
            
            const nominees = await NomineeService.getNominees(editionKey);

            const categoryData = nominees.find((categoryData: Category) => categoryData.category === category);

            if (!categoryData) {
                res.status(404).send('Category not found');
                return;
            }

            const editionCategory = await EditionService.getCategory(editionKey, category);

            const nomineesData = categoryData.nominees.map((nominee: Nominee) => {
                const isWinner = editionCategory?.winner === nominee.name;
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
        const editionKey = (req.body.editionKey || req.query.edition) as string | undefined;

        try {
            const nextWinner = await EditionService.updateWinner(editionKey, category, nominee);
            res.status(200).send(nextWinner ? 'Winner registered' : 'Winner removed');
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }
}

export default new NomineeController();