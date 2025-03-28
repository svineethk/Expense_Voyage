const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');


const JWT_SECRET_KEY = 'jwt_secret_key'

const assignmentRoutes = (db) => {

    router.get('/getTripByEmployee/:id', async(req,res) => {
        const {id} = req.params;
        const query = `select * from trip where employee_id = ?`
        try{
            const employee = await db.all(query,[parseInt(id)]);
            res.status(200).json(employee)
        }catch(error){
            res.status(500).send(`DB Error: ${error.message}`);
        }   
    })
    return router
}

module.exports = assignmentRoutes