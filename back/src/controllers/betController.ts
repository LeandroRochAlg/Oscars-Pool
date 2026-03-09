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

            // Filter by categories in pool
            const poolCategories = pool.categories.map((category: any) => category.category);
            const poolNominees = nominees.filter((category: Category) => poolCategories.includes(category.category));

            // Get winners
            const edition = await EditionService.resolveEdition(editionKey);

            // Get user bets
            const userBets = pool.users[0].bets as BetSelection | undefined;

            type BetNominee = Nominee & { isWinner: boolean };

            const userBetsInfo: { category: string; weight: number; nominees: (Nominee & { isWinner: boolean; })[]; }[] = [];

            // Get user bets with isWinners
            if (userBets) {
                userBets.userBets.forEach((bet: Bet) => {
                    const category = poolNominees.find((category: Category) => category.category === bet.category);

                    if (category) {
                        const betNominees: BetNominee[] = [];

                        bet.nominees.forEach((nominee: string) => {
                            betNominees.push({
                                name: nominee,
                                detail: category.nominees.find((nomineeData: Nominee) => nomineeData.name === nominee)?.detail || '',
                                movieImage: category.nominees.find((nomineeData: Nominee) => nomineeData.name === nominee)?.movieImage || '',
                                isWinner: edition.categories.find((entry) => entry.category === bet.category)?.winner === nominee
                            });
                        });

                        userBetsInfo.push({
                            category: bet.category,
                            weight: pool.categories.find((categoryData: any) => categoryData.category === bet.category).weight,
                            nominees: betNominees
                        });
                    }
                });
            } else {
                // If user has no bets, return all categories with nominees and winners
                poolNominees.forEach((category: Category) => {
                    const betNominees: BetNominee[] = [];

                    category.nominees.forEach((nominee: Nominee) => {
                        betNominees.push({
                            ...nominee,
                            isWinner: edition.categories.find((entry) => entry.category === category.category)?.winner === nominee.name
                        });
                    });

                    userBetsInfo.push({
                        category: category.category,
                        weight: pool.categories.find((categoryData: any) => categoryData.category === category.category).weight,
                        nominees: betNominees
                    });
                });
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