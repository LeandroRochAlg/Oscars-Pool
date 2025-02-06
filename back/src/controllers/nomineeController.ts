import { Request, Response } from 'express';
import NomineeService from '../services/nomineeService';

class NomineeController {
    async getCategories(_req: Request, res: Response) {
        try {
            // Get only the categories names from the json file
            const nominees = await NomineeService.getNominees();

            const categories: string[] = [];

            nominees.map((category: any) => {
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

            const categoryData = nominees.find((categoryData: any) => categoryData.category === category);

            if (!categoryData) {
                res.status(404).send('Category not found');
                return;
            }

            const nomineesList: any[] = categoryData.nominees;

            res.status(200).json(nomineesList);
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }
}

export default new NomineeController();