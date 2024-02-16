// src/db/dbOperations.ts

import { MongoClient, Db } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import { Token } from '../models/token';

export let db: Db;

// Connects to the database and returns the connected database instance
export const connectDatabase = async (uri: string) => {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        console.log("Connected to the database");
        db = client.db("pool"); // Connects to the pool database
    } catch (error) {
        console.error("Error connecting to the database", error);
        throw error; // Throws the error to be handled at the higher level
    }
};

// Generates and saves a token to the database
export const generateToken = async (isAdmin: boolean): Promise<string> => {
    const newToken: Token = {
        token: uuidv4(),
        isAdmin,
        isUsed: false
    };

    console.log('Token generated: ', newToken.token);

    await db.collection<Token>('tokens').insertOne(newToken);

    return newToken.token;
};