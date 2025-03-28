const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');


const JWT_SECRET_KEY = 'jwt_secret_key'

const employeeRoutes = (db) => {
  router.get('/allemployee', async (req, res) => {
    const query = 'SELECT * FROM employee';
    try {
      const employees = await db.all(query);
      res.status(200).json(employees);
    } catch (error) {
      res.status(500).send(`DB Error: ${error.message}`);
    }
  });

  router.get('/createTrip', async (req, res) => {
    try {
      // Logic for creating a trip if necessary
      res.status(200).json({
        message: 'This is where the trip creation logic goes.',
      });
    } catch (error) {
      res.status(500).json({ error: `Error: ${error.message}` });
    }
  });


  router.get('/employeeById/:id', async(req,res) => {
    const {id} = req.params;
    const query = 'select * from employee where id = ?';
    try{
        const employee = await db.get(query,[id]);
        res.status(200).json(employee)
    }catch(error){
        res.status(500).send(`DB Error: ${error.message}`);
    }
  })



  router.post('/employeeByEmail', async(req,res) => {
    const {email} = req.body;
    const query = 'select * from employee where email = ?';
    try{
        const employee = await db.get(query,[email]);
        res.status(200).json(employee)
    }catch(error){
        res.status(500).send(`DB Error: ${error.message}`);
    }
  })


  router.post('/login', async (req,res) => {
    const {email,password} = req.body;
    let query = `select * from employee where email = ?`;
    try{
      const employee = await db.get(query,[email]);
      if(employee !== undefined){
        if(parseInt(password) === employee.phoneNumber){
          const payload = {
            email: employee.email
          }
          const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '6h' });
          res.status(200).json({
            message: 'Login successful',
            token: token,
          });
        }else{
          res.status(404).json({ error: 'Incorrect Password' });
        }
      }else{
        res.status(404).json({ error: 'User not found' });
      }
    }catch(error){
      res.status(500).json({ error: `DB Error: ${error.message}` });
    }
  })

  router.post('/createTripRequest', async (req, res) => {
    const { employee_id, client_place, start_date, end_date } = req.body;

    if (!employee_id || !client_place || !start_date || !end_date) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const checkEmployeeQuery = 'SELECT * FROM employee WHERE id = ?';
    try {
        const employee = await db.get(checkEmployeeQuery, [parseInt(employee_id)]);

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        const insertTripQuery = `INSERT INTO trip (employee_id, client_place, start_date, end_date, status) 
                                 VALUES (?, ?, ?, ?, ?)`;
        const status = 'PENDING';
        await db.run(insertTripQuery, [employee_id, client_place, start_date, end_date, status]);

        return res.status(201).json({ success: true, message: 'Trip request submitted successfully' });

    } catch (error) {
        console.error('Error processing trip request:', error);
        return res.status(500).json({ error: `DB Error: ${error.message}` });
    }
});

return router;

};

module.exports = employeeRoutes;
