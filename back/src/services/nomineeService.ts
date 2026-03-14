import { Category } from '../models/category';
import EditionService from './editionService';

class NomineeService {
    async getNominees(editionKey?: string | null): Promise<Category[]> {
        const edition = await EditionService.resolveEdition(editionKey);

        return edition.categories.map(({ category, nominees }) => ({
            category,
            nominees,
        }));
    }
}

export default new NomineeService();