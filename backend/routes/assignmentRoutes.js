
import express from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const JWT_SECRET_KEY = 'jwt_secret_key';
const router = express.Router();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
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

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const assignmentRoutes = (db) => {
  router.get('/getTripByEmployee/:id', async (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM trips WHERE employee_id = ?`;
    try {
      const employee = await db.all(query, [parseInt(id)]);
      res.status(200).json(employee);
    } catch (error) {
      res.status(500).send(`DB Error: ${error.message}`);
    }
  });

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

      const insertTripQuery = `
        INSERT INTO trips (employee_id, client_place, start_date, end_date, status)
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
      const { tripId, totalSpent } = req.body;
      const settleAmount = parseInt(totalSpent) - 50000;
      const tripAppendQuery = `
        UPDATE trips SET total_expense = ?, balance_settlement = ? WHERE trip_id = ?`;

      await db.run(tripAppendQuery, [totalSpent, settleAmount, tripId]);

      res.status(200).send({ message: 'Files uploaded successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error uploading files');
    }
  });

  router.get('/allTrips', async (req, res) => {
    const query = 'SELECT * FROM trips ORDER BY employee_id ASC';
    try {
      const allTrips = await db.all(query);
      res.status(200).send(allTrips);
    } catch (error) {
      res.status(500).send(`DB Error: ${error.message}`);
    }
  });

  router.post('/updateStatusByTripId/:tripId', async (req, res) => {
    const { tripId } = req.params;
    const { status } = req.body;

    const query = `UPDATE trips SET status = ? WHERE trip_id = ?`;
    try {
      await db.run(query, [status, tripId]);
      res.status(200).send("Updated Successfully");
    } catch (error) {
      res.status(500).send(`DB Error : ${error.message}`);
    }
  });

  router.get('/getTripImages/:tripId', async (req, res) => {
    const { tripId } = req.params;
    const tripFolder = path.join(__dirname, 'uploads', tripId);

    if (!fs.existsSync(tripFolder)) {
      return res.status(404).send('No images found for this trip');
    }

    fs.readdir(tripFolder, (err, files) => {
      if (err) {
        return res.status(500).send('Error reading images');
      }

      const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|bmp)$/i.test(file));
      const imageUrls = imageFiles.map(file => `/uploads/${tripId}/${file}`);

      res.status(200).json(imageUrls);
    });
  });

  return router;
};

export default assignmentRoutes;
