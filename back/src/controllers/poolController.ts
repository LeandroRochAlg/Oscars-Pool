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

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;

            const result = await pools
                .find({
                    $or: [
                        { public: true },
                        { users: { $elemMatch: { user: req.user._id } } }
                    ]
                }, {
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
                    users: -1
                })
                .skip(skip)
                .limit(limit)
                .toArray();

            const total = await pools.countDocuments({
                $or: [
                    { public: true },
                    { users: { $elemMatch: { user: req.user._id } } }
                ]
            });
            const totalPages = Math.ceil(total / limit);

            res.status(200).send({
                pools: result,
                page,
                totalPages,
                totalPools: total
            });
        } catch (error) {
            res.status(500).send({ error: 'An error occurred while getting the pools.' });
        }
    }

    // getPoolsByUser

    // getPoolsBySearch

    // getPoolByToken
    
    // getPool

    // enterPool

    // exitPool

    // banUser

    // updatePool

    // deletePool
}

export default new PoolController();