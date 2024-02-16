// src/app.ts

import express, { Application, Request, Response } from 'express';
import { connectDatabase } from './db/dbOperations';
import dotenv from 'dotenv';
import newTokenRouter from './routes/newToken';
import registerRouter from './routes/register';
import loginRouter from './routes/login';

dotenv.config();

const port = process.env.PORT || 3000;
const app: Application = express();

app.use(express.json());

// Routers
app.use('/newToken', newTokenRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);

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