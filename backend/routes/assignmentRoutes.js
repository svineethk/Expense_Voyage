const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const app = express();


const JWT_SECRET_KEY = 'jwt_secret_key'

const uploadsDirectory = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsDirectory));

// Multer setup to handle file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDirectory);  // Save files in the external uploads folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});



const upload = multer({ storage: storage });

const assignmentRoutes = (db) => {

    router.get('/getTripByEmployee/:id', async(req,res) => {
        const {id} = req.params;
        const query = `select * from trips where employee_id = ?`
        try{
            const employee = await db.all(query,[parseInt(id)]);
            res.status(200).json(employee)
        }catch(error){
            res.status(500).send(`DB Error: ${error.message}`);
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
    
            const insertTripQuery = `INSERT INTO trips (employee_id, client_place, start_date, end_date, status) 
                                     VALUES (?, ?, ?, ?, ?)`;
            const status = 'PENDING';
            await db.run(insertTripQuery, [employee_id, client_place, start_date, end_date, status]);
    
            return res.status(201).json({ success: true, message: 'Trip request submitted successfully' });
    
        } catch (error) {
            console.error('Error processing trip request:', error);
            return res.status(500).json({ error: `DB Error: ${error.message}` });
        }
    });


    router.post('/uploadTripDetails', upload.array('bills[]'), async (req, res) => {
        try {
            const { tripId, totalSpent } = req.body;
            const files = req.files;

            if (!tripId || !totalSpent || !files) {
                return res.status(400).json({ error: 'tripId, totalSpent, and files are required' });
            }

            const filePaths = files.map((file, index) => {
                const type = req.body[`bills[${index}][type]`];
                return { path: file.path, type: type };
            });

            console.log('filePaths suceesfully Uploaded:');

            // ... your database logic here

            res.status(200).json({ success: true, message: 'Trip details updated successfully' });
        } catch (error) {
            console.error('Error uploading trip details:', error);
            res.status(500).send(`Error updating trip details: ${error.message}`);
        }
    });
      

    return router
}

module.exports = assignmentRoutes