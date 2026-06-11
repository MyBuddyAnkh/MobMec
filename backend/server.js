// ----------------------------------------
// Import packages
// ----------------------------------------

const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import PostgreSQL connection pool
const pool = require("./db");

// ----------------------------------------
// Create Express app
// ----------------------------------------

const app = express();

const PORT = process.env.PORT || 5000;

// ----------------------------------------
// Middleware
// ----------------------------------------

app.use(cors());
app.use(express.json());

// ----------------------------------------
// Test route
// ----------------------------------------

app.get("/", function (req, res) {
    res.send("MobMec backend with PostgreSQL is running");
});

// ----------------------------------------
// GET /requests
// Get all service requests from PostgreSQL
// ----------------------------------------

app.get("/requests", async function (req, res) {
    try {
        const result = await pool.query(
            `
            SELECT 
                id,
                customer_name AS "customerName",
                customer_phone AS "customerPhone",
                vehicle_make AS "vehicleMake",
                vehicle_model AS "vehicleModel",
                vehicle_year AS "vehicleYear",
                service_type AS "serviceType",
                customer_location AS "customerLocation",
                problem_description AS "problemDescription",
                urgency,
                status,
                created_at AS "createdAt"
            FROM requests
            ORDER BY created_at DESC
            `
        );

        res.json(result.rows);

    } catch (error) {
        console.error("Error getting requests:", error);

        res.status(500).json({
            message: "Could not load requests from database"
        });
    }
});

// ----------------------------------------
// POST /requests
// Create a new service request in PostgreSQL
// ----------------------------------------

app.post("/requests", async function (req, res) {
    try {
        const {
            customerName,
            customerPhone,
            vehicleMake,
            vehicleModel,
            vehicleYear,
            serviceType,
            customerLocation,
            problemDescription,
            urgency
        } = req.body;

        // Basic validation
        if (
            !customerName ||
            !customerPhone ||
            !serviceType ||
            !customerLocation ||
            !problemDescription
        ) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }

        const result = await pool.query(
            `
            INSERT INTO requests (
                customer_name,
                customer_phone,
                vehicle_make,
                vehicle_model,
                vehicle_year,
                service_type,
                customer_location,
                problem_description,
                urgency,
                status
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING
                id,
                customer_name AS "customerName",
                customer_phone AS "customerPhone",
                vehicle_make AS "vehicleMake",
                vehicle_model AS "vehicleModel",
                vehicle_year AS "vehicleYear",
                service_type AS "serviceType",
                customer_location AS "customerLocation",
                problem_description AS "problemDescription",
                urgency,
                status,
                created_at AS "createdAt"
            `,
            [
                customerName,
                customerPhone,
                vehicleMake || null,
                vehicleModel || null,
                vehicleYear || null,
                serviceType,
                customerLocation,
                problemDescription,
                urgency || "Medium",
                "Pending"
            ]
        );

        res.status(201).json({
            message: "Request created successfully",
            request: result.rows[0]
        });

    } catch (error) {
        console.error("Error creating request:", error);

        res.status(500).json({
            message: "Could not create request in database"
        });
    }
});

// ----------------------------------------
// PATCH /requests/:id/status
// Update request status in PostgreSQL
// ----------------------------------------

app.patch("/requests/:id/status", async function (req, res) {
    try {
        const requestId = Number(req.params.id);
        const { status } = req.body;

        const allowedStatuses = [
            "Pending",
            "Accepted",
            "Rejected",
            "In Progress",
            "Completed",
            "Cancelled"
        ];

        if (!status || !allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const result = await pool.query(
            `
            UPDATE requests
            SET status = $1
            WHERE id = $2
            RETURNING
                id,
                customer_name AS "customerName",
                customer_phone AS "customerPhone",
                vehicle_make AS "vehicleMake",
                vehicle_model AS "vehicleModel",
                vehicle_year AS "vehicleYear",
                service_type AS "serviceType",
                customer_location AS "customerLocation",
                problem_description AS "problemDescription",
                urgency,
                status,
                created_at AS "createdAt"
            `,
            [status, requestId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Request not found"
            });
        }

        res.json({
            message: "Status updated successfully",
            request: result.rows[0]
        });

    } catch (error) {
        console.error("Error updating request status:", error);

        res.status(500).json({
            message: "Could not update request status"
        });
    }
});

// ----------------------------------------
// DELETE /requests/:id
// Optional testing route
// ----------------------------------------

app.delete("/requests/:id", async function (req, res) {
    try {
        const requestId = Number(req.params.id);

        const result = await pool.query(
            `
            DELETE FROM requests
            WHERE id = $1
            RETURNING id
            `,
            [requestId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Request not found"
            });
        }

        res.json({
            message: "Request deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting request:", error);

        res.status(500).json({
            message: "Could not delete request"
        });
    }
});

// ----------------------------------------
// Start server
// ----------------------------------------

app.listen(PORT, function () {
    console.log(`MobMec backend running on http://localhost:${PORT}`);
});