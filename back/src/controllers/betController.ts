import { Request, Response } from 'express';
import { db } from '../db/dbOperations';
import { ObjectId } from 'mongodb';
import { Nominee } from '../models/nominee';
import { Bet } from '../models/bet';
import { User } from '../models/user';
import { Category } from '../models/category';

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
}

export default new BetController();