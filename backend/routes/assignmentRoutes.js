const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const app = express();


const JWT_SECRET_KEY = 'jwt_secret_key'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, 'uploads/expenses'));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `${req.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
  });
  
  const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only JPEG, PNG, and PDF files are allowed'), false);
      }
    }
  });

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


    // router.post('/uploadTripDetails', upload.array('bills[]'), async (req, res) => {
    //     try {
    //         const { tripId, totalSpent } = req.body;
    //         const files = req.files;

    //         if (!tripId || !totalSpent || !files) {
    //             return res.status(400).json({ error: 'tripId, totalSpent, and files are required' });
    //         }

    //         const filePaths = files.map((file, index) => {
    //             const type = req.body[`bills[${index}][type]`];
    //             return { path: file.path, type: type };
    //         });

    //         console.log('filePaths suceesfully Uploaded:');

    //         // ... your database logic here

    //         res.status(200).json({ success: true, message: 'Trip details updated successfully' });
    //     } catch (error) {
    //         console.error('Error uploading trip details:', error);
    //         res.status(500).send(`Error updating trip details: ${error.message}`);
    //     }
    // });

    router.post('/submit-expenses/:tripId',
        upload.array('expenseFiles'), 
        async (req, res) => {
          try {
            const { tripId } = req.params;
            const { types, amounts } = req.body;
            const files = req.files;
      
            // Validate
            if (!types || !amounts || !files || 
                types.length !== amounts.length || 
                amounts.length !== files.length) {
              return res.status(400).json({ error: 'Invalid data format' });
            }
      
            // Save to database
            const queries = files.map((file, index) => {
              return db.run(
                `INSERT INTO expense_documents 
                (trip_id, employee_id, type, file_path, amount) 
                VALUES (?, ?, ?, ?, ?)`,
                [tripId, req.user.id, types[index], file.path, amounts[index]]
              );
            });
      
            await Promise.all(queries);
      
            // Update trip status
            await db.run(
              `UPDATE trips SET status = 'EXPENSES_SUBMITTED' WHERE id = ?`,
              [tripId]
            );
      
            res.status(200).json({ success: true });
          } catch (error) {
            console.error('Error submitting expenses:', error);
            res.status(500).json({ error: 'Server error' });
          }
        }
      );
      

    return router
}

module.exports = assignmentRoutes