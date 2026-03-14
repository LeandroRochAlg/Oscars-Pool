import { Request, Response } from 'express';
import { db } from '../db/dbOperations';
import { ObjectId } from 'mongodb';
import { Nominee } from '../models/nominee';
import { Bet, BetSelection } from '../models/bet';
import { Category } from '../models/category';
import NomineeService from '../services/nomineeService';
import EditionService from '../services/editionService';

class BetController {
    async createBet(req: Request, res: Response) {
        const user = req.user;
        const incomingBets = req.body as BetSelection | Bet[];
        const poolId = req.params.poolId;

        try {
            const pools = db.collection('pools');

            const pool = await pools.findOne(
                {
                    _id: ObjectId.createFromHexString(poolId),
                    'users.user': user._id
                },
                {
                    projection: {
                        editionKey: 1,
                    }
                }
            );

            if (!pool) {
                res.status(404).send('Pool not found');
                return;
            }

            const currentDate = new Date();
            const oscarDate = await EditionService.getBetDeadline(pool.editionKey);

            if (currentDate > oscarDate) {
                res.status(400).send('Bets are closed');
                return;
            }

            const bets: BetSelection = Array.isArray(incomingBets)
                ? { userBets: incomingBets }
                : incomingBets;

            const userBets = await pools.findOne(
                {
                    _id: ObjectId.createFromHexString(poolId),
                    'users.user': user._id
                },
                {
                    projection: {
                        'users.$': 1
                    }
                }
            );

            if (!userBets) {
                res.status(404).send('Pool not found');
                return;
            }

            await pools.updateOne(
                {
                    _id: ObjectId.createFromHexString(poolId),
                    'users.user': user._id
                },
                {
                    $set: {
                        'users.$.bets': bets
                    }
                }
            );

            res.status(200).send('Bet created');
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }

    async getBets(req: Request, res: Response) {
        const user = req.user;
        const poolId = req.params.poolId;
    
        try {
            const poolsCollection = db.collection('pools');
    
            // Get user bets
            const pool = await poolsCollection.findOne(
                {
                    _id: ObjectId.createFromHexString(poolId),
                    'users.user': user._id
                },
                {
                    projection: {
                        editionKey: 1,
                        categories: 1,
                        'users.$': 1
                    }
                }
            );

            if (!pool) {
                res.status(404).send('Pool not found');
                return;
            }

            // Get nominees
            const editionKey = pool.editionKey;
            const nominees = await NomineeService.getNominees(editionKey);

            // Filter by categories currently configured in the pool
            const poolCategories = pool.categories.map((category: any) => category.category);
            const poolNominees = nominees.filter((category: Category) => poolCategories.includes(category.category));
            const poolCategoryWeights = new Map<string, number>(
                pool.categories.map((category: any) => [category.category, category.weight])
            );
            const poolCategorySet = new Set(poolCategories);

            // Get winners
            const edition = await EditionService.resolveEdition(editionKey);

            // Get user bets
            const userBets = pool.users[0].bets as BetSelection | undefined;
            const storedBets = userBets?.userBets ?? [];

            type BetNominee = Nominee & { isWinner: boolean };

            const userBetsInfo: { category: string; weight: number; nominees: (Nominee & { isWinner: boolean; })[]; }[] = [];

            // Normalize stored bets: keep only categories and nominees still valid for current pool config.
            const normalizedStoredBets: Bet[] = storedBets
                .filter((bet) => poolCategorySet.has(bet.category))
                .map((bet) => {
                    const categoryData = poolNominees.find((entry) => entry.category === bet.category);
                    const allowedNominees = new Set((categoryData?.nominees ?? []).map((nominee) => nominee.name));

                    return {
                        category: bet.category,
                        nominees: bet.nominees.filter((nominee) => allowedNominees.has(nominee)),
                    };
                });

            // Always return categories from the current pool config, even if the user has no stored ranking yet.
            poolNominees.forEach((category: Category) => {
                const betNominees: BetNominee[] = [];
                const storedCategoryBet = normalizedStoredBets.find((bet) => bet.category === category.category);
                const nomineeByName = new Map(category.nominees.map((nominee) => [nominee.name, nominee]));
                const orderedNominees: Nominee[] = [];
                const includedNominees = new Set<string>();

                (storedCategoryBet?.nominees ?? []).forEach((nomineeName) => {
                    const nomineeData = nomineeByName.get(nomineeName);

                    if (nomineeData && !includedNominees.has(nomineeName)) {
                        orderedNominees.push(nomineeData);
                        includedNominees.add(nomineeName);
                    }
                });

                category.nominees.forEach((nominee) => {
                    if (!includedNominees.has(nominee.name)) {
                        orderedNominees.push(nominee);
                    }
                });

                orderedNominees.forEach((nominee) => {
                    betNominees.push({
                        ...nominee,
                        isWinner: edition.categories.find((entry) => entry.category === category.category)?.winner === nominee.name
                    });
                });

                userBetsInfo.push({
                    category: category.category,
                    weight: poolCategoryWeights.get(category.category) ?? 0,
                    nominees: betNominees
                });
            });

            // Persist cleanup so stale categories are removed from stored bets over time.
            if (userBets && JSON.stringify(normalizedStoredBets) !== JSON.stringify(storedBets)) {
                await poolsCollection.updateOne(
                    {
                        _id: ObjectId.createFromHexString(poolId),
                        'users.user': user._id
                    },
                    {
                        $set: {
                            'users.$.bets': {
                                userBets: normalizedStoredBets,
                            }
                        }
                    }
                );
            }

            const currentDate = new Date();
            const oscarDate = await EditionService.getBetDeadline(editionKey);

            const canUpdateBets = currentDate < oscarDate;

            res.status(200).json({ userBets: userBetsInfo, canUpdateBets });
        } catch (error) {
            console.error('Error getting bets:', error);
            res.status(500).send('Internal Server Error');
        }
    }
}

export default new BetController();