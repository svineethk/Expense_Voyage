import express from 'express';
const router = express.Router();
import jwt from 'jsonwebtoken';


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


  router.post('/signup', async (req, res) => {
    const { name, email, phoneNumber, designation, department } = req.body;
  
    if (!name || !email || !phoneNumber || !designation || !department) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    try {
      
      const existingUserQuery = 'SELECT * FROM employee WHERE email = ?';
      const existingUser = await db.get(existingUserQuery, [email]);
  
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists with this email' });
      }
  
      
      const countQuery = 'SELECT COUNT(*) as count FROM employee';
      const countResult = await db.get(countQuery);
      const newId = 1001 + countResult.count;
  
      
      const insertQuery = `
        INSERT INTO employee (id, name, email, phoneNumber, designation, department)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      await db.run(insertQuery, [newId, name, email, phoneNumber, designation, department]);
  
      
      const payload = { email };
      const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '6h' });
  
      res.status(201).json({
        message: 'Signup successful',
        token,
      });
  
    } catch (error) {
      res.status(500).json({ error: `DB Error: ${error.message}` });
    }
  });
  
  

return router;

};

export default employeeRoutes;
