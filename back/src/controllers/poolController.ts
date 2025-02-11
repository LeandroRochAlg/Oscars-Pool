import { Request, Response } from 'express';
import { db } from '../db/dbOperations';
import { Pool } from '../models/pool';
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
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
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

    // getPoolByToken
    
    // getPool

    // enterPool

    // exitPool

    // banUser

    // updatePool

    // deletePool
}

export default new PoolController();