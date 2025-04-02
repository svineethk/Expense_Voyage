const express = require('express');
const router = express.Router();


const expressRoutes = (db) => { 
    router.get('/dashboard', async (req, res) => {
        try {
            const query = `
                SELECT
                    COUNT(t.trip_id) AS totalTrips,
                    SUM(CASE WHEN t.status = 'PENDING' THEN 1 ELSE 0 END) AS pendingTrips,
                    SUM(CASE WHEN t.status = 'APPROVED' THEN 1 ELSE 0 END) AS approvedTrips,
                    SUM(t.initial_amount) AS totalInitialAmount,
                    SUM(CASE WHEN t.status = 'APPROVED' THEN t.total_expense - t.balance_settlement ELSE 0 END) AS totalPendingReimbursements
                FROM trips t;
            `;
            const rows = await db.all(query);
            const dashboardData = rows[0] || {  //handle if no data
                totalTrips: 0,
                pendingTrips: 0,
                approvedTrips: 0,
                totalInitialAmount: 0,
                totalPendingReimbursements: 0
            };
            res.json({ dashboard: dashboardData });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });


    router.get('/monthly-trips', async (req, res) => {
        try {
            const query = `
                SELECT
                    strftime('%m', start_date) AS month,
                    COUNT(trip_id) AS tripCount
                FROM trips
                GROUP BY month
                ORDER BY month;
            `;
            const rows = await db.all(query);
            if (rows.length === 0) {
                return res.status(200).json({ monthlyTrips: [] });
            }
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const monthlyTripData = rows.map(row => ({
                month: months[parseInt(row.month) - 1],
                tripCount: row.tripCount
            }));
            res.json({ monthlyTrips: monthlyTripData });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    router.get('/trip-status', async (req, res) => {
        try {
            const query = `
                SELECT
                    status,
                    COUNT(*) AS count
                FROM trips
                GROUP BY status;
            `;
            const rows = await db.all(query);
            if (rows.length === 0) {
                return res.status(200).json({ tripStatus: {} });
            }
            res.json({ tripStatus: rows });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });


    router.get('/trip-status', async (req, res) => {
        try {
            const query = `
                SELECT
                    e.id AS employeeId,
                    e.name,
                    COUNT(t.trip_id) AS tripsTaken,
                    SUM(t.total_expense) AS totalAmountReimbursed
                FROM employee e
                LEFT JOIN trips t ON e.id = t.employee_id
                GROUP BY e.id, e.name;
            `;
            const rows = await db.all(query);
            if (rows.length === 0) {
                return res.status(200).json({ employeeTrips: [] });
            }
            const employeeTripData = rows.map(row => ({
                employeeId: row.employeeId,
                name: row.name,
                tripsTaken: row.tripsTaken || 0,
                totalAmountReimbursed: row.totalAmountReimbursed || 0
            }));
            res.json({ employeeTrips: employeeTripData });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    router.get('/employee-trips', async (req, res) => {
        try {
            const query = `
                SELECT
                    e.id AS employeeId,
                    e.name,
                    COUNT(t.trip_id) AS tripsTaken,
                    SUM(t.total_expense) AS totalAmountReimbursed
                FROM employee e
                LEFT JOIN trips t ON e.id = t.employee_id
                GROUP BY e.id, e.name;
            `;
            const rows = await db.all(query);
            const employeeTripData = rows.map(row => ({
                employeeId: row.employeeId,
                name: row.name,
                tripsTaken: row.tripsTaken || 0,
                totalAmountReimbursed: row.totalAmountReimbursed || 0
            }));
            res.json({ employeeTrips: employeeTripData });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });


    router.get('/trip-requests', async (req, res) => {
        try {
            const query = `
                SELECT
                    trip_id,
                    employee_id,
                    client_place,
                    start_date,
                    end_date,
                    status,
                    initial_amount
                FROM trips;
            `;
            const rows = await db.all(query);
            if (rows.length === 0) {
                return res.status(200).json({ tripRequests: [] });
            }
            res.json({ tripRequests: rows });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });


    router.put('/trip-requests/:id', (req, res) => {
        let tripId = req.params.id
        const { status } = req.body;
        tripId = parseInt(tripId)
    
        const query = `
            UPDATE trips
            SET status = ?
            WHERE trip_id = ?;
        `;
    
        db.run(query, [status, tripId]);
        res.json({ message: 'Trip request updated successfully' });
    });



    return router;
}

module.exports = expressRoutes;
