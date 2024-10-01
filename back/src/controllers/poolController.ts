import { Request, Response } from 'express';
import { db } from '../db/dbOperations';

class PoolController{
    async createPool(req: Request, res: Response) {
        // Create a new pool
        try {
            const { name, categories } = req.body;
            const poolsCollection = db.collection('pools');
            const pool = await poolsCollection.insertOne({ name, categories });
            const insertedPool = await poolsCollection.findOne({ _id: pool.insertedId });
            res.status(201).json(insertedPool);
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }
}

export default PoolController;