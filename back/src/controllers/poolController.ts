import { Request, Response } from 'express';
import { db } from '../db/dbOperations';
import { Pool } from '../models/pool';
import { Bet } from '../models/bet';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';

type PoolCreation = Pick<Pool, 'name' | 'description' | 'public'  | 'categories'>;

class PoolController{
    async createPool(req: Request, res: Response) {
        try {
            const pool: PoolCreation = req.body;
            const userId = req.user._id;

            const inviteToken = uuidv4();

            const pools = db.collection('pools');

            const newPool: Pool = {
                ...pool,
                inviteToken,
                users: [{ user: userId, admin: true }],
                createdBy: userId,
                createdAt: new Date()
            };

            const result = await pools.insertOne(newPool);

            // Add the pool to the user's pools
            const users = db.collection('users');
            await users.updateOne(
                { _id: ObjectId.createFromHexString(userId) },
                { $push: { pools: result.insertedId } }
            );

            res.status(201).send(result.insertedId);
        } catch (error) {
            res.status(500).send({ error: 'An error occurred while creating the pool.' });
        }
    }

    // get pools info ordered by number of users in the pool
    async getPoolsByUserNumber(req: Request, res: Response) {
        try {
            const pools = db.collection('pools');

            const limit = parseInt(req.query.limit as string) || 10;
            const cursor = req.query.cursor as string;

            const query: any = {
                $or: [
                    { public: true },
                    { users: { $elemMatch: { user: req.user._id } } }
                ]
            }

            if (cursor) {
                query['_id'] = { $gt: ObjectId.createFromHexString(cursor) };
            }

            const result = await pools
                .find(query, {
                    projection: {
                        name: 1,
                        description: 1,
                        public: 1,
                        categories: { $size: "$categories" },
                        users: { $size: "$users" },
                        isAdmin: { $cond: [{ $in: [req.user._id, "$users.user"] }, { $arrayElemAt: ["$users.admin", { $indexOfArray: ["$users.user", req.user._id] }] }, false] },
                        isCreator: { $eq: [req.user._id, "$createdBy"] }
                    }
                })
                .sort({
                    users: -1,
                    _id: 1
                })
                .limit(limit)
                .toArray();
            
            const lastCursor = result.length > 0 ? result[result.length - 1]._id : null;

            res.status(200).send({
                pools: result,
                nextCursor: lastCursor,
                hasMore: result.length === limit,
            });
        } catch (error) {
            res.status(500).send({ error: 'An error occurred while getting the pools.' });
        }
    }

    // get all the pools the current user is in
    async getPoolsByUser(req: Request, res: Response) {
        try {
            const pools = db.collection('pools');

            const limit = parseInt(req.query.limit as string) || 10;
            const cursor = req.query.cursor as string;

            const query: any = {
                users: { $elemMatch: { user: req.user._id } }
            };

            if (cursor) {
                query['_id'] = { $gt: ObjectId.createFromHexString(cursor) };
            }

            const result = await pools
                .find(query, {
                    projection: {
                        name: 1,
                        description: 1,
                        public: 1,
                        categories: { $size: "$categories" },
                        users: { $size: "$users" },
                        isAdmin: { $cond: [{ $in: [req.user._id, "$users.user"] }, { $arrayElemAt: ["$users.admin", { $indexOfArray: ["$users.user", req.user._id] }] }, false] },
                        isCreator: { $eq: [req.user._id, "$createdBy"] }
                    }
                })
                .sort({
                    users: -1,
                    _id: 1
                })
                .limit(limit)
                .toArray();

            const lastCursor = result.length > 0 ? result[result.length - 1]._id : null;

            res.status(200).send({
                pools: result,
                nextCursor: lastCursor,
                hasMore: result.length === limit,
            });
        } catch (error) {
            res.status(500).send({ error: 'An error occurred while getting the pools.' });
        }
    }

    // get pools by search
    async getPoolsBySearch(req: Request, res: Response) {
        try {
            const pools = db.collection('pools');

            const limit = parseInt(req.query.limit as string) || 10;
            const cursor = req.query.cursor as string;
            const search = req.query.search as string;

            const query: any = {
                $and: [
                    {
                        $or: [
                            { name: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } }
                        ]
                    },
                    {
                        $or: [
                            { public: true },
                            { users: { $elemMatch: { user: req.user._id } } }
                        ]
                    }
                ]
            };

            if (cursor) {
                query['_id'] = { $gt: ObjectId.createFromHexString(cursor) };
            }

            const result = await pools
                .find(query, {
                    projection: {
                        name: 1,
                        description: 1,
                        public: 1,
                        categories: { $size: "$categories" },
                        users: { $size: "$users" },
                        isAdmin: { $cond: [{ $in: [req.user._id, "$users.user"] }, { $arrayElemAt: ["$users.admin", { $indexOfArray: ["$users.user", req.user._id] }] }, false] },
                        isCreator: { $eq: [req.user._id, "$createdBy"] }
                    }
                })
                .sort({
                    users: -1,
                    _id: 1
                })
                .limit(limit)
                .toArray();

            const lastCursor = result.length > 0 ? result[result.length - 1]._id : null;

            res.status(200).send({
                pools: result,
                nextCursor: lastCursor,
                hasMore: result.length === limit,
            });
        } catch (error) {
            res.status(500).send({ error: 'An error occurred while getting the pools.' });
        }
    }

    // get pool info by token
    async getPoolByToken(req: Request, res: Response) {
        try {
            const pools = db.collection('pools');

            const token = req.params.token as string;

            const result = await pools.findOne(
                { inviteToken: token },
                {
                    projection: {
                        name: 1,
                        description: 1,
                        public: 1,
                        categories: { $size: "$categories" },
                        users: { $size: "$users" },
                        alreadyIn: { $in: [req.user._id, "$users.user"] }
                    }
                }
            );

            if (!result) {
                res.status(404).send({ error: 'Pool not found.' });
                return;
            }

            res.status(200).send(result);
        } catch (error) {
            res.status(500).send({ error: 'An error occurred while getting the pool.' });
        }
    }
    
    // get pool leaderboard
    async getPoolLeaderboard(req: Request, res: Response) {
        try {
            const poolId = req.params.poolId as string;
            const pools = db.collection('pools');
            const winners = db.collection('winners');

            // Get the pool info
            const pool = await pools.findOne(
                { _id: ObjectId.createFromHexString(poolId) },
                {
                    projection: {
                        name: 1,
                        description: 1,
                        public: 1,
                        categories: 1,
                        users: 1,
                        createdBy: 1,
                        createdAt: 1
                    }
                }
            );

            if (!pool) {
                res.status(404).send({ error: 'Pool not found.' });
                return;
            }

            // Check if the user is in the pool
            const isUserInPool = pool.users.some((user: any) => user.user === req.user._id);

            if (!isUserInPool) {
                res.status(403).send({ error: 'You are not a member of this pool.' });
                return;
            }

            // Get the winners from the categories of the pool
            const categoryWinners = await winners.find({
                category: { $in: pool.categories }
            }).toArray();

            // Map the winners to the categories
            const winnersMap = new Map<string, string>();
            categoryWinners.forEach(winner => {
                winnersMap.set(winner.category, winner.user);
            });

            // Calculate the leaderboard
            const leaderboard = [];

            for (const userPool of pool.users) {
                const user = await db.collection('users').findOne(
                    { _id: ObjectId.createFromHexString(userPool.user) },
                    {
                        projection: {
                            username: 1
                        }
                    }
                );

                if (!user) {
                    continue;
                }

                let score = 0;

                // For each category
                for (const category of pool.categories) {
                    const winner = winnersMap.get(category);

                    if (!winner) {
                        continue;
                    }

                    const userBet = userPool.bets.find((bet: Bet) => bet.category === category);

                    if (!userBet) {
                        continue;
                    }

                    const winnerIndex = userBet.nominees.indexOf(winner);

                    if (winnerIndex === -1) {
                        continue;
                    }

                    switch (winnerIndex) {
                        case 0:
                            score += category.weight;
                            break;
                        case 1:
                            score += category.weight * 0.6;
                            break;
                        case 2:
                            score += category.weight * 0.4;
                            break;
                        case 3:
                            score += category.weight * 0.2;
                            break;
                        default:
                            break;
                    }
                }

                leaderboard.push({
                    user: user.username,
                    score
                });
            }

            // Sort the leaderboard
            leaderboard.sort((a, b) => b.score - a.score);

            res.status(200).send({
                leaderboard
            });
        } catch (error) {
            res.status(500).send({ error: 'An error occurred while getting the pool.' });
        }
    }

    // joinPool

    // exitPool

    // banUser

    // updatePool

    // deletePool

    // addAdmin

    // removeAdmin
}

export default new PoolController();