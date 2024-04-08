// src/app.ts

import express, { Application, Request, Response } from 'express';
import { connectDatabase } from './db/dbOperations';
import dotenv from 'dotenv';
import { routes } from './routes/index';
import cors from 'cors';

dotenv.config();

const port = process.env.PORT || 3100;
const app: Application = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(routes);

// Open the server on the specified port
(async () => {
  try {
    await connectDatabase(process.env.MONGODB_URI || '');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error connecting to the database', error);
  }
})();

app.get('/', async (req: Request, res: Response) => {
  try {
    res.send('Hello World!');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});