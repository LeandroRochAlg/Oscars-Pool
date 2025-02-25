// src/db/dbOperations.ts

import { MongoClient, Db } from 'mongodb';

export let db: Db;

// Connects to the database and returns the connected database instance
export const connectDatabase = async (uri: string) => {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        console.log("Connected to the database");

        const dbName = process.env.MONGODB_NAME || 'pool';
        
        db = client.db(dbName); // Connects to the pool database
    } catch (error) {
        console.error("Error connecting to the database", error);
        throw error; // Throws the error to be handled at the higher level
    }
};