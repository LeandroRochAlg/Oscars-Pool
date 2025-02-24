import { Request, Response } from 'express';
import { db } from '../db/dbOperations';
import { ObjectId } from 'mongodb';
import { Nominee } from '../models/nominee';
import { Bet } from '../models/bet';
import { User } from '../models/user';
import { Category } from '../models/category';
import NomineeService from '../services/nomineeService';

class BetController {
    async createBet(req: Request, res: Response) {
        const user = req.user;
        const bets = req.body as Bet[];
        const poolId = req.params.poolId;

        try {
            const pools = db.collection('pools');

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
            const winnersCollection = db.collection('winners');
    
            // Get user bets
            const pool = await poolsCollection.findOne(
                {
                    _id: ObjectId.createFromHexString(poolId),
                    'users.user': user._id
                },
                {
                    projection: {
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
            const nominees = await NomineeService.getNominees();

            // Filter by categories in pool
            const poolCategories = pool.categories.map((category: any) => category.category);
            const poolNominees = nominees.filter((category: Category) => poolCategories.includes(category.category));

            // Get winners
            const winners = await winnersCollection.find().toArray();

            // Get user bets
            const userBets = pool.users[0].bets;

            type BetNominee = Nominee & { isWinner: boolean };

            const userBetsInfo: { category: string; weight: number; nominees: (Nominee & { isWinner: boolean; })[]; }[] = [];

            // Get user bets with isWinners
            if (userBets) {
                userBets.forEach((bet: Bet) => {
                    const category = poolNominees.find((category: Category) => category.category === bet.category);

                    if (category) {
                        const betNominees: BetNominee[] = [];

                        bet.nominees.forEach((nominee: string) => {
                            betNominees.push({
                                name: nominee,
                                detail: category.nominees.find((nomineeData: Nominee) => nomineeData.name === nominee)?.detail || '',
                                movieImage: category.nominees.find((nomineeData: Nominee) => nomineeData.name === nominee)?.movieImage || '',
                                isWinner: winners.some((winner) => winner.category === bet.category && winner.nominee === nominee)
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
                            isWinner: winners.some((winner) => winner.category === category.category && winner.nominee === nominee.name)
                        });
                    });

                    userBetsInfo.push({
                        category: category.category,
                        weight: pool.categories.find((categoryData: any) => categoryData.category === category.category).weight,
                        nominees: betNominees
                    });
                });
            }

            // Check the date to see if the user can update the bets
            const currentDate = new Date();

            // Oscar date: March 2, 2025, 9 PM (Brasília time)
            const oscarDate = new Date("2025-03-02T21:00:00-03:00");

            const canUpdateBets = currentDate < oscarDate;

            res.status(200).json({ userBets: userBetsInfo, canUpdateBets });
        } catch (error) {
            console.error('Error getting bets:', error);
            res.status(500).send('Internal Server Error');
        }
    }
}

export default new BetController();