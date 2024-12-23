import express from 'express';
import { body, validationResult } from 'express-validator';
import cors from 'cors';
import initRoutes from './src/routes';

import bodyParser from 'body-parser';
import dbInit from './src/db/db_init';

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true
}

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Simple route to test server
app.post('/hello', [
body('name').isString().withMessage('Name must be a string').notEmpty().withMessage('Name cannot be empty'),
], (req: any, res: any) => {
const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({ errors: errors.array() });
}
const { name } = req.body;
res.json({ message: `Hello, ${name}!` });
});

initRoutes(app);

// Start the server
const server = app.listen(port, () => {
  console.log(`database env var: ${process.env.DATABASE_HOST_DEV}`);
  console.log(`Server running at http://localhost:${port}`);
});

async function start() {
  await dbInit();
}
if (require.main === module) {
  start();
  console.log("Server started (main module)");
}

export { app, server }