import fs from 'fs';
import path from 'path';
import { db } from '../db/dbOperations';
import { OSCAR_2026_CATEGORIES } from '../data/editionSeeds';
import { Category } from '../models/category';
import { Edition, EditionCategory, EditionSummary } from '../models/edition';

const DEFAULT_EDITION_KEY = '2025';
const DEFAULT_ACTIVE_EDITION_KEY = '2026';
const DEFAULT_OSCAR_2025_DATE = new Date('2025-03-02T21:00:00-03:00');
const DEFAULT_OSCAR_2026_DATE = new Date('2026-03-15T20:00:00-03:00');

type EditionSeed = Pick<Edition, 'key' | 'label' | 'year' | 'ceremonyDate' | 'betDeadline' | 'isActive' | 'categories'>;

class EditionService {
    private async dedupeEditions() {
        const editionsCollection = db.collection<Edition>('editions');
        const duplicateKeys = await editionsCollection.aggregate<{ _id: string; ids: Edition['_id'][]; count: number }>([
            {
                $group: {
                    _id: '$key',
                    ids: { $push: '$_id' },
                    count: { $sum: 1 },
                },
            },
            {
                $match: {
                    count: { $gt: 1 },
                },
            },
        ]).toArray();

        for (const duplicateKey of duplicateKeys) {
            const editions = await editionsCollection.find({ key: duplicateKey._id }).sort({ isActive: -1, updatedAt: -1, createdAt: -1, _id: 1 }).toArray();

            const [editionToKeep, ...duplicatesToDelete] = editions;

            if (!editionToKeep || duplicatesToDelete.length === 0) {
                continue;
            }

            await editionsCollection.deleteMany({
                _id: {
                    $in: duplicatesToDelete
                        .map((edition) => edition._id)
                        .filter((id): id is NonNullable<Edition['_id']> => Boolean(id)),
                },
            });
        }
    }

    private async ensureIndexes() {
        await db.collection<Edition>('editions').createIndex({ key: 1 }, { unique: true });
    }

    private async buildOscar2025Seed(): Promise<EditionSeed> {
        const nomineesPath = path.join(process.cwd(), 'src', 'data', 'nominees.json');
        const nomineesData = fs.readFileSync(nomineesPath, 'utf-8');
        const nominees: Category[] = JSON.parse(nomineesData);
        const winners = await db.collection<{ category: string; nominee: string }>('winners').find().toArray();
        const winnersMap = new Map(winners.map((winner) => [winner.category, winner.nominee]));

        const categories: EditionCategory[] = nominees.map((category) => ({
            ...category,
            winner: winnersMap.get(category.category) ?? null,
        }));

        return {
            key: DEFAULT_EDITION_KEY,
            label: 'Oscar 2025',
            year: 2025,
            ceremonyDate: DEFAULT_OSCAR_2025_DATE,
            betDeadline: DEFAULT_OSCAR_2025_DATE,
            isActive: false,
            categories,
        };
    }

    private buildOscar2026Seed(): EditionSeed {
        return {
            key: DEFAULT_ACTIVE_EDITION_KEY,
            label: 'Oscar 2026',
            year: 2026,
            ceremonyDate: DEFAULT_OSCAR_2026_DATE,
            betDeadline: DEFAULT_OSCAR_2026_DATE,
            isActive: true,
            categories: OSCAR_2026_CATEGORIES,
        };
    }

    private async ensureEdition(seed: EditionSeed) {
        const now = new Date();

        await db.collection<Edition>('editions').updateOne(
            { key: seed.key },
            {
                $setOnInsert: {
                    ...seed,
                    createdAt: now,
                    updatedAt: now,
                },
            },
            { upsert: true }
        );
    }

    private async migrateLegacyPools() {
        await db.collection('pools').updateMany(
            {
                $or: [
                    { editionKey: { $exists: false } },
                    { editionKey: null },
                    { editionKey: '' },
                ],
            },
            {
                $set: {
                    editionKey: DEFAULT_EDITION_KEY,
                },
            }
        );
    }

    private async ensureSeeded() {
        await this.dedupeEditions();
        await this.ensureEdition(await this.buildOscar2025Seed());
        await this.ensureEdition(this.buildOscar2026Seed());

        await db.collection<Edition>('editions').updateMany(
            { key: { $ne: DEFAULT_ACTIVE_EDITION_KEY }, isActive: true },
            { $set: { isActive: false, updatedAt: new Date() } }
        );

        await db.collection<Edition>('editions').updateOne(
            { key: DEFAULT_ACTIVE_EDITION_KEY },
            { $set: { isActive: true, updatedAt: new Date() } }
        );

        await this.migrateLegacyPools();
        await this.dedupeEditions();
        await this.ensureIndexes();
    }

    async listEditions(): Promise<EditionSummary[]> {
        await this.ensureSeeded();

        return db.collection<Edition>('editions')
            .find({}, {
                projection: {
                    key: 1,
                    label: 1,
                    year: 1,
                    ceremonyDate: 1,
                    betDeadline: 1,
                    isActive: 1,
                },
            })
            .sort({ year: -1 })
            .toArray() as Promise<EditionSummary[]>;
    }

    async getActiveEdition(): Promise<Edition> {
        await this.ensureSeeded();

        const activeEdition = await db.collection<Edition>('editions').findOne({ isActive: true });

        if (activeEdition) {
            return activeEdition;
        }

        const fallbackEdition = await db.collection<Edition>('editions').findOne({}, { sort: { year: -1 } });

        if (!fallbackEdition) {
            throw new Error('No editions available');
        }

        return fallbackEdition;
    }

    async resolveEdition(editionKey?: string | null): Promise<Edition> {
        await this.ensureSeeded();

        if (editionKey) {
            const edition = await db.collection<Edition>('editions').findOne({ key: editionKey });

            if (!edition) {
                throw new Error(`Edition not found: ${editionKey}`);
            }

            return edition;
        }

        return this.getActiveEdition();
    }

    async getCategories(editionKey?: string | null) {
        const edition = await this.resolveEdition(editionKey);
        return edition.categories.map((category) => category.category);
    }

    async getCategory(editionKey: string | null | undefined, categoryKey: string) {
        const edition = await this.resolveEdition(editionKey);
        return edition.categories.find((category) => category.category === categoryKey) ?? null;
    }

    async updateWinner(editionKey: string | null | undefined, categoryKey: string, nominee: string) {
        const edition = await this.resolveEdition(editionKey);
        const category = edition.categories.find((entry) => entry.category === categoryKey);

        if (!category) {
            throw new Error('Category not found');
        }

        const nextWinner = category.winner === nominee ? null : nominee;

        await db.collection<Edition>('editions').updateOne(
            { key: edition.key, 'categories.category': categoryKey },
            {
                $set: {
                    'categories.$.winner': nextWinner,
                    updatedAt: new Date(),
                },
            }
        );

        return nextWinner;
    }

    async activateEdition(editionKey: string) {
        const edition = await this.resolveEdition(editionKey);
        const now = new Date();

        await db.collection<Edition>('editions').updateMany(
            { isActive: true },
            { $set: { isActive: false, updatedAt: now } }
        );

        await db.collection<Edition>('editions').updateOne(
            { key: edition.key },
            { $set: { isActive: true, updatedAt: now } }
        );

        return this.resolveEdition(edition.key);
    }

    async getBetDeadline(editionKey?: string | null) {
        const edition = await this.resolveEdition(editionKey);
        return edition.betDeadline;
    }
}

export const DEFAULT_FALLBACK_EDITION_KEY = DEFAULT_EDITION_KEY;
export default new EditionService();
