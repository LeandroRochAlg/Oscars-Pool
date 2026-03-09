import { Request, Response } from 'express';
import { db } from '../db/dbOperations';
import { Pool } from '../models/pool';
import { Bet } from '../models/bet';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';
import EditionService, { DEFAULT_FALLBACK_EDITION_KEY } from '../services/editionService';

type PoolCreation = Pick<Pool, 'name' | 'description' | 'public'  | 'categories' | 'editionKey'>;

type PoolCursor = {
    users: number;
    id: string;
};

class PoolController{
    private encodeCursor(cursor: PoolCursor) {
        return `${cursor.users}:${cursor.id}`;
    }

    private parseCursor(rawCursor?: string) {
        if (!rawCursor) {
            return null;
        }

        const separatorIndex = rawCursor.indexOf(':');

        if (separatorIndex === -1) {
            return null;
        }

        const users = Number(rawCursor.slice(0, separatorIndex));
        const id = rawCursor.slice(separatorIndex + 1);

        if (Number.isNaN(users) || !ObjectId.isValid(id)) {
            return null;
        }

        return {
            users,
            id,
        } satisfies PoolCursor;
    }

    private getEditionMatch(editionKey?: string) {
        if (!editionKey) {
            return null;
        }

        if (editionKey === DEFAULT_FALLBACK_EDITION_KEY) {
            return {
                $or: [
                    { editionKey: DEFAULT_FALLBACK_EDITION_KEY },
                    { editionKey: { $exists: false } },
                ],
            };
        }

        return { editionKey };
    }

    private buildPoolListPipeline(req: Request, baseMatch: Record<string, any>, limit: number, cursor?: string) {
        const pipeline: Record<string, any>[] = [
            { $match: baseMatch },
            {
                $addFields: {
                    editionKey: { $ifNull: ['$editionKey', DEFAULT_FALLBACK_EDITION_KEY] },
                    usersCount: { $size: '$users' },
                    categoriesCount: { $size: '$categories' },
                    isAdmin: {
                        $cond: [
                            { $in: [req.user._id, '$users.user'] },
                            { $arrayElemAt: ['$users.admin', { $indexOfArray: ['$users.user', req.user._id] }] },
                            false,
                        ],
                    },
                    isCreator: { $eq: [req.user._id, '$createdBy'] },
                    isMember: { $in: [req.user._id, '$users.user'] },
                },
            },
        ];

        const parsedCursor = this.parseCursor(cursor);

        if (parsedCursor) {
            pipeline.push({
                $match: {
                    $or: [
                        { usersCount: { $lt: parsedCursor.users } },
                        {
                            usersCount: parsedCursor.users,
                            _id: { $gt: ObjectId.createFromHexString(parsedCursor.id) },
                        },
                    ],
                },
            });
        }

        pipeline.push(
            { $sort: { usersCount: -1, _id: 1 } },
            { $limit: limit },
            {
                $project: {
                    name: 1,
                    description: 1,
                    public: 1,
                    editionKey: 1,
                    categories: '$categoriesCount',
                    users: '$usersCount',
                    isAdmin: 1,
                    isCreator: 1,
                    isMember: 1,
                },
            },
        );

        return pipeline;
    }

    async createPool(req: Request, res: Response) {
        try {
            const pool: PoolCreation = req.body;
            const userId = req.user._id;

            const inviteToken = uuidv4();

            const pools = db.collection('pools');

            const edition = await EditionService.resolveEdition(pool.editionKey);

            const newPool: Pool = {
                ...pool,
                editionKey: edition.key,
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
            const editionKey = req.query.editionKey as string | undefined;

            const baseQuery: any = {
                $or: [
                    { public: true },
                    { users: { $elemMatch: { user: req.user._id } } }
                ]
            }

            const editionMatch = this.getEditionMatch(editionKey);
            const query = editionMatch ? { $and: [baseQuery, editionMatch] } : baseQuery;

            const result = await pools.aggregate(this.buildPoolListPipeline(req, query, limit, cursor)).toArray();
            
            const lastCursor = result.length > 0 ? this.encodeCursor({ users: result[result.length - 1].users, id: result[result.length - 1]._id.toString() }) : null;

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
            const editionKey = req.query.editionKey as string | undefined;

            const baseQuery: any = {
                users: { $elemMatch: { user: req.user._id } }
            };

            const editionMatch = this.getEditionMatch(editionKey);
            const query = editionMatch ? { $and: [baseQuery, editionMatch] } : baseQuery;

            const result = await pools.aggregate(this.buildPoolListPipeline(req, query, limit, cursor)).toArray();

            const lastCursor = result.length > 0 ? this.encodeCursor({ users: result[result.length - 1].users, id: result[result.length - 1]._id.toString() }) : null;

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
            const editionKey = req.query.editionKey as string | undefined;

            const baseQuery: any = {
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

            const editionMatch = this.getEditionMatch(editionKey);
            const query = editionMatch ? { $and: [baseQuery, editionMatch] } : baseQuery;

            const result = await pools.aggregate(this.buildPoolListPipeline(req, query, limit, cursor)).toArray();

            const lastCursor = result.length > 0 ? this.encodeCursor({ users: result[result.length - 1].users, id: result[result.length - 1]._id.toString() }) : null;

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
                        editionKey: { $ifNull: ['$editionKey', DEFAULT_FALLBACK_EDITION_KEY] },
                        public: 1,
                        categories: { $size: "$categories" },
                        users: { $size: "$users" },
                        isAdmin: { $cond: [{ $in: [req.user._id, "$users.user"] }, { $arrayElemAt: ["$users.admin", { $indexOfArray: ["$users.user", req.user._id] }] }, false] },
                        isCreator: { $eq: [req.user._id, "$createdBy"] },
                        isMember: { $in: [req.user._id, "$users.user"] }
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
                        editionKey: { $ifNull: ['$editionKey', DEFAULT_FALLBACK_EDITION_KEY] },
                        public: 1,
                        inviteToken: 1,
                        categories: 1,
                        users: 1,
                        createdBy: 1,
                        createdAt: 1,
                        isUserInPool: { $in: [req.user._id, "$users.user"] },
                        isAdmin: { $cond: [{ $in: [req.user._id, "$users.user"] }, { $arrayElemAt: ["$users.admin", { $indexOfArray: ["$users.user", req.user._id] }] }, false] },
                        isCreator: { $eq: [req.user._id, "$createdBy"] }
                    }
                }
            );
    
            if (!pool) {
                res.status(404).send({ error: 'Pool not found.' });
                return;
            }
    
            // Check if the user is in the pool
            if (!pool.isUserInPool && !pool.public) {
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
    
            res.status(200).send({
                ...pool,
                users: usersWithDetails,
                createdBy: creator ? creator.username : null
            });
        } catch (error) {
            res.status(500).send({ error: 'An error occurred while getting the pool.' });
        }
    }
    
    // get pool leaderboard
    async getPoolLeaderboard(req: Request, res: Response) {
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
                        editionKey: 1,
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

            const winnersMap = new Map<string, string>();
            const edition = await EditionService.resolveEdition(pool.editionKey);
            edition.categories.forEach((category) => {
                if (category.winner) {
                    winnersMap.set(category.category, category.winner);
                }
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
                    const winner = winnersMap.get(category.category);

                    if (!winner) {
                        continue;
                    }

                    if (!userPool.bets){
                        continue;
                    }

                    const userBet = userPool.bets.userBets.find((bet: Bet) => bet.category === category.category);

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
            console.log(error);
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