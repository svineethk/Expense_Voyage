const express = require('express');
const router = express.Router();

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

  return router;
};

module.exports = employeeRoutes;
