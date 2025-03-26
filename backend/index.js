const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

const employeeRoutes = require('./routes/employeeRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');

const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const dbPath = path.join(__dirname, 'company.db');

const Port = process.env.PORT || 5000;

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

  app.use('/employee', employeeRoutes(db)); //http://localhost:5000/employee/allemployee/ //http://localhost:5000/employee/employeeById/1004/ 
  app.use('/trip', assignmentRoutes(db));

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
