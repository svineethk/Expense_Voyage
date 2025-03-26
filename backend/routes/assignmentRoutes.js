const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');


const JWT_SECRET_KEY = 'jwt_secret_key'

const assignmentRoutes = (db) => {
    router.get('/getTripByEmployee/:id', async(req,res) => {
        const query = `select * from trip where employee_id`
    })
    return router
}

export default assignmentRoutes