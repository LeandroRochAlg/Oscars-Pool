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
                { _id: ObjectId.createFromHexString(userId) },              // TODO: update the 'new ObjectId()' structure
                { $push: { pools: result.insertedId } }
            );

            res.status(201).send(result.insertedId);
        } catch (error) {
            res.status(500).send({ error: 'An error occurred while creating the pool.' });
        }
    }
}

export default new PoolController();