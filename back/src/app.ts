import express, { Application, Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || '';
const port = process.env.PORT || 3000;

const app: Application = express();

const connectDatabase = async () => {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to the database");
    return client.db(); // Returns the connected database instance
  } catch (error) {
    console.error("Error connecting to the database", error);
    throw error; // Throws the error to be handled at the higher level
  }
};

(async () => {
  try {
    await connectDatabase(); // Connects to the database when the server starts
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error starting the server", error);
    process.exit(1); // Exits the process if there is an error starting the server
  }
})();

app.get('/', async (req: Request, res: Response) => {
  try {
    // Here you can use the database connection to perform operations
    res.send('Hello World!');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});