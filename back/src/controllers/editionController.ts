import { Request, Response } from 'express';
import EditionService from '../services/editionService';

class EditionController {
    async listEditions(_req: Request, res: Response) {
        try {
            const editions = await EditionService.listEditions();
            res.status(200).json(editions);
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }

    async getActiveEdition(_req: Request, res: Response) {
        try {
            const edition = await EditionService.getActiveEdition();
            res.status(200).json({
                key: edition.key,
                label: edition.label,
                year: edition.year,
                ceremonyDate: edition.ceremonyDate,
                betDeadline: edition.betDeadline,
                isActive: edition.isActive,
            });
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }

    async activateEdition(req: Request, res: Response) {
        try {
            const edition = await EditionService.activateEdition(req.params.key);
            res.status(200).json({
                key: edition.key,
                label: edition.label,
                year: edition.year,
                ceremonyDate: edition.ceremonyDate,
                betDeadline: edition.betDeadline,
                isActive: edition.isActive,
            });
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }
}

export default new EditionController();
