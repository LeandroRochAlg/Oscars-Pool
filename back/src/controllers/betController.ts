// src/controllers/betController.ts

import { Request, Response } from 'express';
import { db } from '../db/dbOperations';

class BetController {
    async getNominees(req: Request, res: Response) {
        try {
            const categories = db.collection('nominees');

            // Rules to aggregate the nominees
            const pipeline = [
                { $unwind: "$nominees" },
                {
                    $lookup: {
                        from: "movies",                             // Join with the movies collection
                        localField: "nominees.movieId",             // Join on the movieId field
                        foreignField: "_id",                        // Join on the _id field
                        as: "movieDetails"                          // Store the joined data in the movieDetails field
                    }
                },
                { $unwind: "$movieDetails" },
                {
                    $addFields: {
                        "nominees.movieTitle": "$movieDetails.name"  // Add the movieTitle field to the nominees
                    }
                },
                {
                    $group: {                                        // Group the nominees by category
                        _id: "$_id",
                        category: { $first: "$category" },
                        nominees: { $push: "$nominees" },
                        winner: { $first: "$winner" }
                    }
                },
                {
                    $project: {
                        "nominees.movieId": 0                        // Remove movieId from the response
                    }
                }
            ];

            const result = await categories.aggregate(pipeline).toArray();

            res.status(200).send(result);
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }
}

export default new BetController();