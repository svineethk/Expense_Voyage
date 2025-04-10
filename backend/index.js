import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import employeeRoutes from './routes/employeeRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';

import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const app = express();
const Port = process.env.PORT || 5000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'company.db');

let db = null;

const initializeDBandServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

const startServer = () => {
  app.use(bodyParser.json());
  app.use(cors());
  app.use('/uploads', express.static(path.join(__dirname, 'routes', 'uploads')));

  app.use('/employee', employeeRoutes(db)); // http://localhost:5000/employee/allemployee/
  app.use('/trip', assignmentRoutes(db));
  app.use('/api', expenseRoutes(db));

  app.listen(Port, () => {
    console.log(`Server is connected successfully and running at http://localhost:${Port}`);
  });
};

initializeDBandServer()
  .then(() => {
    startServer();
  })
  .catch((error) => {
    console.error(`Failed to initialize DB: ${error.message}`);
    process.exit(1);
  });

app.get('/', (req, res) => {
  res.send('Database and server are connected successfully');
});
