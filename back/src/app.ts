// src/app.ts

import express, { Application, Request, Response } from 'express';
import { connectDatabase } from './db/dbOperations';
import dotenv from 'dotenv';
import { routes } from './routes/index';
import cors from 'cors';

dotenv.config();

const port = process.env.PORT || 3100;
const app: Application = express();

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS Error: This origin is not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

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