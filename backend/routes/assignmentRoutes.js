const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const app = express();
const fs = require('fs');
const path = require('path');
const cors = require('cors');


const JWT_SECRET_KEY = 'jwt_secret_key'
app.use(cors());
const uploadPath = path.join(__dirname, 'uploads');

if(!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tripId = req.body.tripId;
    if (!tripId) {
      return cb(new Error('Trip ID is required'), null);
    }

    const tripFolder = path.join(uploadPath, tripId);
    if (!fs.existsSync(tripFolder)) {
      fs.mkdirSync(tripFolder, { recursive: true });
    }

    cb(null, tripFolder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});


const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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


    
  router.post('/uploadTripDetails', upload.array('bills[]', 10), async (req, res) => {
    try {
      const tripId = req.body.tripId;
      const totalSpent = req.body.totalSpent;
      const settleAmount = parseInt(totalSpent) - 50000
      const tripAppendQuery = `UPDATE trips SET total_expense = ?,balance_settlement = ? WHERE trip_id = ?`;


      await db.run(tripAppendQuery, [totalSpent, settleAmount, tripId]);

      res.status(200).send({message:'Files uploaded successfully!'});
    } catch (error) {
      console.error(error);
      res.status(500).send('Error uploading files');
    }
  });

  router.get('/uploadTripDetails',async (req, res) => {
    res.send('Upload trip details page');
  })

  return router
}

module.exports = assignmentRoutes