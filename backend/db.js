// ----------------------------------------
// Database connection file
// ----------------------------------------

// dotenv loads environment variables from .env file
require("dotenv").config();

// Pool comes from pg package.
// A pool manages multiple database connections efficiently.
const { Pool } = require("pg");

// Create a PostgreSQL connection pool
const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// Test database connection when backend starts
pool.connect()
    .then(function (client) {
        console.log("Connected to PostgreSQL database");
        client.release();
    })
    .catch(function (error) {
        console.error("PostgreSQL connection error:", error.message);
    });

// Export pool so server.js can use it
module.exports = pool;