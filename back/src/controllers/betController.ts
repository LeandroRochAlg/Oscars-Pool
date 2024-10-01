// src/controllers/betController.ts

import { Request, Response } from 'express';
import { db } from '../db/dbOperations';
import { ObjectId } from 'mongodb';
import { Nominee } from '../models/nominee';

class BetController {
    async getNominees(req: Request, res: Response) {
        try {
            const users = db.collection('users');
            const user = await users.findOne({ username: req.user.username });

            if (!user) {
                res.status(404).send('User not found');
                return;
            }

            const userId = user._id;

            const categoriesCollection = db.collection('nominees');

            // Convert userId to ObjectId if stored as ObjectId in the bets collection
            const userObjectId: ObjectId = new ObjectId(userId);
    
            // Define the aggregation pipeline to retrieve nominees and their movie details
            const pipeline = [
                { $unwind: "$nominees" },
                {
                    $lookup: {
                        from: "movies",
                        localField: "nominees.movieId",
                        foreignField: "_id",
                        as: "movieDetails"
                    }
                },
                { $unwind: "$movieDetails" },
                {
                    $addFields: {
                        "nominees.movieTitle": "$movieDetails.name",
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        category: { $first: "$category" },
                        nominees: { $push: "$nominees" },
                        value: { $first: "$value" },
                        winner: { $first: "$winner" }
                    }
                },
                {
                    $project: {
                        "nominees.movieId": 0
                    }
                },
                {
                    $sort: { category: 1 }
                }
            ];
    
            const categoriesWithMovies = await categoriesCollection.aggregate(pipeline).toArray();
    
            // Additional step to merge user's bets with the nominees
            // This requires fetching the user's bets and adjusting the result accordingly
            const betsCollection = db.collection('bets');
            const userBets = await betsCollection.find({ userId: userObjectId }).toArray();
    
            // Map user's bets for easier lookup
            const userBetsMap = userBets.reduce((acc: any, bet: any) => {
                acc[bet.categoryId.toString()] = bet.nomineeId;
                return acc;
            }, {});
    
            // Adjust the result to include information about the user's bets
            const adjustedResult = categoriesWithMovies.map(category => {
                category.nominees.forEach((nominee: Nominee) => {
                    // Check if the user has placed a bet on this nominee
                    nominee.userBet = userBetsMap[category._id.toString()] === nominee.id;
                });
                return category;
            });
    
            console.log('Answer sent!');
            res.status(200).json(adjustedResult);
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }

    async makeBet(req: Request, res: Response) {
        // If the date is past the Oscars, return error
        const currentDate = new Date();
        const oscarsDate = new Date('2024-03-10T23:00:00.000Z');

        if (currentDate > oscarsDate) {
            res.status(403).send('The Oscars have already happened');
            return;
        }
                
        try {
            const { categoryId, nomineeId } = req.body;
            const bets = db.collection('bets');

            const username = req.user.username;

            const users = db.collection('users');
            const userdb = await users.findOne({ username });

            if (!userdb) {
                res.status(404).send('User not found');
                return;
            }

            const userId = userdb._id;

            // Check if the user has already made a bet for this category
            const existingBet = await bets.findOne({ userId, categoryId: new ObjectId(categoryId) });

            if (existingBet) {  // Change the bet if it already exists
                await bets.updateOne({ userId, categoryId: new ObjectId(categoryId) }, { $set: { nomineeId } });
                res.status(200).send('Bet updated');
                return;
            }

            const bet = {
                userId,
                categoryId: new ObjectId(categoryId),
                nomineeId
            };

            await bets.insertOne(bet);

            res.status(201).send('Bet created');
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }

    async registerWinner(req: Request, res: Response) {
        // If the date is prior to the Oscars, return error
        const currentDate = new Date();
        const oscarsDate = new Date('2024-03-10T23:00:00.000Z');

        if (currentDate < oscarsDate) {
            res.status(403).send('The Oscars have not happened yet');
            return;
        }

        try {
            const { categoryId, nomineeId } = req.body;
            const categories = db.collection('nominees');
            const category = await categories.findOne({ _id: new ObjectId(categoryId) });

            if (!category) {
                res.status(404).send('Category not found');
                return;
            }

            const updatedCategory = {
                ...category,
                winner: nomineeId
            };

            await categories.updateOne({ _id: new ObjectId(categoryId) }, { $set: updatedCategory });

            res.status(200).send('Winner registered');
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }
    
    async getLeaderboard(req: Request, res: Response) {
        // Get all users and their total points based on their bets and the winners

        try {
            const usersCollection = db.collection('users');
            const betsCollection = db.collection('bets');
            const categoriesCollection = db.collection('nominees');

            const users = await usersCollection.find().toArray();
            const bets = await betsCollection.find().toArray();
            const categories = await categoriesCollection.find().toArray();

            interface userBet {
                username: string;
                userId: ObjectId;
                points: number;
                hits: number
            }

            const userBets: userBet[] = [];

            users.forEach(user => {
                const newUser = {
                    username: user.username,
                    userId: user._id,
                    points: 0,
                    hits: 0
                };

                userBets.push(newUser);
            });

            bets.forEach(bet => {
                const category = categories.find(category => category._id.toString() === bet.categoryId.toString());

                if (category) {
                    if (category.winner === bet.nomineeId) {
                        const user = userBets.find(user => user.userId.toString() === bet.userId.toString());
                        if (user) {
                            user.points += category.value;
                            user.hits++;
                        }
                    }
                }
            });

            userBets.sort((a, b) => b.points - a.points);

            res.status(200).json(userBets);
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }
}

export default new BetController();