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

    // update pool
    async updatePool(req: Request, res: Response) {
        try {
            const poolId = req.params.poolId as string;
            const pool: PoolCreation = req.body;

            const pools = db.collection('pools');

            // Check if the pool exists and if the user is an admin
            const existingPool = await pools.findOne(
                { _id: ObjectId.createFromHexString(poolId) },
                { projection: { users: 1 } }
            );

            if (!existingPool) {
                res.status(404).send({ error: 'Pool not found.' });
                return;
            }

            const isAdmin = existingPool.users.some((user: any) => user.user === req.user._id && user.admin);

            if (!isAdmin) {
                res.status(403).send({ error: 'Only admins can update the pool.' });
                return;
            }

            const result = await pools.updateOne(
                { _id: ObjectId.createFromHexString(poolId) },
                { $set: pool }
            );

            if (result.matchedCount === 0) {
                res.status(404).send({ error: 'Pool not found.' });
                return;
            }

            res.status(200).send();
        } catch (error) {
            res.status(500).send({ error: 'An error occurred while updating the pool.' });
        }
    }

    // delete pool
    async deletePool(req: Request, res: Response) {
        try {
            const poolId = req.params.poolId as string;
            const pools = db.collection('pools');
            const users = db.collection('users');

            // Check if the pool exists and if the user is the creator
            const existingPool = await pools.findOne(
                { _id: ObjectId.createFromHexString(poolId) },
                { projection: { createdBy: 1 } }
            );

            if (!existingPool) {
                res.status(404).send({ error: 'Pool not found.' });
                return;
            }

            if (existingPool.createdBy !== req.user._id) {
                res.status(403).send({ error: 'Only the creator can delete the pool.' });
                return;
            }

            // Remove the pool from the users
            for (const user of await users.find({ pools: ObjectId.createFromHexString(poolId) }).toArray()) {
                await users.updateOne(
                    { _id: user._id },
                    { $pull: { pools: ObjectId.createFromHexString(poolId) } }
                );
            }

            // Delete the pool
            const result = await pools.deleteOne(
                { _id: ObjectId.createFromHexString(poolId) }
            );

            if (result.deletedCount === 0) {
                res.status(404).send({ error: 'Pool not found.' });
                return;
            }

            res.status(200).send();
        } catch (error) {
            res.status(500).send({ error: 'An error occurred while deleting the pool.' });
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

    // get pool info
    async getPoolInfo(req: Request, res: Response) {
        try {
            const poolId = req.params.poolId as string;
            const pools = db.collection('pools');
    
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
    
            // Get the users and the creator in one request
            const userIds = pool.users.map((userPool: any) => ObjectId.createFromHexString(userPool.user));
            userIds.push(ObjectId.createFromHexString(pool.createdBy));

            const users = await db.collection('users').find(
                { _id: { $in: userIds } },
                {
                    projection: {
                        username: 1
                    }
                }
            ).toArray();

            const usersWithDetails = pool.users.map((userPool: any) => {
                const user = users.find(u => u._id.equals(ObjectId.createFromHexString(userPool.user)));
                return {
                    userId: userPool.user,
                    username: user ? user.username : null,
                    admin: userPool.admin
                };
            });

            const creator = users.find(u => u._id.equals(ObjectId.createFromHexString(pool.createdBy)));
    
            // Build the result
            const result = {
                _id: pool._id,
                name: pool.name,
                description: pool.description,
                public: pool.public,
                categories: pool.categories,
                users: usersWithDetails,
                createdBy: creator ? creator.username : null,
                createdAt: pool.createdAt
            };
    
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

            const userIds = pool.users.map((userPool: any) => ObjectId.createFromHexString(userPool.user));
            const users = await db.collection('users').find(
                { _id: { $in: userIds } },
                {
                    projection: {
                        username: 1
                    }
                }
            ).toArray();

            for (const userPool of pool.users) {
                const user = users.find(u => u._id.equals(ObjectId.createFromHexString(userPool.user)));

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

    // join a pool
    async joinPool(req: Request, res: Response) {
        try {
            const { poolId, inviteToken } = req.body;
            const pools = db.collection('pools');

            // Check if the pool exists
            const pool = await pools.findOne(
                { _id: ObjectId.createFromHexString(poolId) },
                {
                    projection: {
                        users: 1,
                        inviteToken: 1,
                        public: 1
                    }
                }
            );

            if (!pool) {
                res.status(404).send({ error: 'Pool not found.' });
                return;
            }
            
            // Check if the user is already in the pool
            const isUserInPool = pool.users.some((user: any) => user.user === req.user._id);
            
            if (isUserInPool) {
                res.status(400).send({ error: 'You are already in this pool.' });
                return;
            }
            
            // Check if the user is allowed to join the pool
            if (!pool.public && pool.inviteToken !== inviteToken) {
                res.status(403).send({ error: 'You are not allowed to join this pool.' });
                return;
            }

            // Add the user to the pool
            await pools.updateOne(
                { _id: ObjectId.createFromHexString(poolId) },
                { $push: { users: { user: req.user._id, admin: false } } }
            );

            // Add the pool to the user's pools
            const users = db.collection('users');

            await users.updateOne(
                { _id: ObjectId.createFromHexString(req.user._id) },
                { $push: { pools: ObjectId.createFromHexString(poolId) } }
            );

            res.status(200).send();
        } catch (error) {
            res.status(500).send({ error: 'An error occurred while joining the pool.' });
        }
    }

    // leave pool
    async leavePool(req: Request, res: Response) {
        try {
            const poolId = req.params.poolId as string;
            const pools = db.collection('pools');

            // Check if the pool exists
            const pool = await pools.findOne(
                { _id: ObjectId.createFromHexString(poolId) },
                {
                    projection: {
                        users: 1,
                        createdBy: 1
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
                res.status(400).send({ error: 'You are not in this pool.' });
                return;
            }

            // Check if the user is the creator
            if (pool.createdBy === req.user._id) {
                res.status(403).send({ error: 'You cannot leave a pool you created.' });
                return;
            }

            // Remove the user from the pool
            await pools.updateOne(
                { _id: ObjectId.createFromHexString(poolId) },
                { $pull: { users: { user: req.user._id } } }
            );

            // Remove the pool from the user's pools
            const users = db.collection('users');

            await users.updateOne(
                { _id: ObjectId.createFromHexString(req.user._id) },
                { $pull: { pools: ObjectId.createFromHexString(poolId) } }
            );

            res.status(200).send();
        } catch (error) {
            res.status(500).send({ error: 'An error occurred while leaving the pool.' });
        }
    }

    // add an admin
    async addAdmin(req: Request, res: Response) {
        try {
            const { poolId, userId } = req.body;
            const pools = db.collection('pools');

            // Check if the pool exists
            const pool = await pools.findOne(
                { _id: ObjectId.createFromHexString(poolId) },
                {
                    projection: {
                        users: 1
                    }
                }
            );

            if (!pool) {
                res.status(404).send({ error: 'Pool not found.' });
                return;
            }

            // Check if the requester is an admin
            const isRequesterAdmin = pool.users.some((user: any) => user.user === req.user._id && user.admin);

            if (!isRequesterAdmin) {
                res.status(403).send({ error: 'Only admins can add another admin.' });
                return;
            }

            // Add admin role to the user
            await pools.updateOne(
                { _id: ObjectId.createFromHexString(poolId), "users.user": userId },
                { $set: { "users.$.admin": true } }
            );

            res.status(200).send();
        } catch (error) {
            res.status(500).send({ error: 'An error occurred while adding the admin.' });
        }
    }

    // remove an admin
    async removeAdmin(req: Request, res: Response) {
        try {
            const { poolId, userId } = req.body;
            const pools = db.collection('pools');

            // Check if the pool exists
            const pool = await pools.findOne(
                { _id: ObjectId.createFromHexString(poolId) },
                {
                    projection: {
                        users: 1
                    }
                }
            );

            if (!pool) {
                res.status(404).send({ error: 'Pool not found.' });
                return;
            }

            // Check if the requester is an admin
            const isRequesterAdmin = pool.users.some((user: any) => user.user === req.user._id && user.admin);

            if (!isRequesterAdmin) {
                res.status(403).send({ error: 'Only admins can remove another admin.' });
                return;
            }

            // Remove admin role from the user
            await pools.updateOne(
                { _id: ObjectId.createFromHexString(poolId), "users.user": userId },
                { $set: { "users.$.admin": false } }
            );

            res.status(200).send();
        } catch (error) {
            res.status(500).send({ error: 'An error occurred while removing the admin.' });
        }
    }

    // ban a user
    async banUser(req: Request, res: Response) {
        try {
            const { poolId, userId } = req.body;
            const pools = db.collection('pools');

            // Check if the pool exists
            const pool = await pools.findOne(
                { _id: ObjectId.createFromHexString(poolId) },
                {
                    projection: {
                        users: 1
                    }
                }
            );

            if (!pool) {
                res.status(404).send({ error: 'Pool not found.' });
                return;
            }

            // Check if the requester is an admin
            const isRequesterAdmin = pool.users.some((user: any) => user.user === req.user._id && user.admin);

            if (!isRequesterAdmin) {
                res.status(403).send({ error: 'Only admins can ban a user.' });
                return;
            }

            // Check if the user is in the pool
            const isUserInPool = pool.users.some((user: any) => user.user === userId);

            if (!isUserInPool) {
                res.status(400).send({ error: 'The user is not in this pool.' });
                return;
            }

            // Check if the user is the creator
            if (pool.createdBy === userId) {
                res.status(403).send({ error: 'You cannot ban the creator of the pool.' });
                return;
            }

            // Remove the user from the pool
            await pools.updateOne(
                { _id: ObjectId.createFromHexString(poolId) },
                { $pull: { users: { user: userId } } }
            );

            // Remove the pool from the user's pools
            const users = db.collection('users');

            await users.updateOne(
                { _id: ObjectId.createFromHexString(userId) },
                { $pull: { pools: ObjectId.createFromHexString(poolId) } }
            );

            res.status(200).send();
        } catch (error) {
            res.status(500).send({ error: 'An error occurred while banning the user.' });
        }
    }
}

export default new PoolController();