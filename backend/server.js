// ------------------------------
// Import required packages
// ------------------------------

// Express helps us create backend routes like GET, POST, PATCH
const express = require("express");

// CORS allows frontend and backend to communicate
// Example: frontend may run on Live Server and backend on localhost:5000
const cors = require("cors");

// ------------------------------
// Create Express app
// ------------------------------

const app = express();

// Backend will run on this port
const PORT = 5000;

// ------------------------------
// Middleware
// ------------------------------

// This allows backend to understand JSON data coming from frontend
app.use(express.json());

// This allows frontend to make requests to backend
app.use(cors());

// ------------------------------
// Temporary data storage
// ------------------------------

// This is acting like a temporary database for now
// Later we will replace this with JSON file, then real database
let requests = [];

// ------------------------------
// Test route
// ------------------------------

// This route is only to check if backend is working
// Open this in browser: http://localhost:5000
app.get("/", function (req, res) {
  res.send("MobMec backend is running");
});

// ------------------------------
// GET /requests
// ------------------------------

// This route sends all mechanic requests to frontend
app.get("/requests", function (req, res) {
  res.json(requests);
});

// ------------------------------
// POST /requests
// ------------------------------

// This route receives new request data from frontend form
app.post("/requests", function (req, res) {
  const data = req.body;

  // Basic validation
  if (
    !data.customerName ||
    !data.phone ||
    !data.carMake ||
    !data.carModel ||
    !data.carYear ||
    !data.problemType ||
    !data.description ||
    !data.address ||
    !data.urgency
  ) {
    return res.status(400).json({
      message: "Please provide all required fields"
    });
  }

  // Create new request object
  const newRequest = {
    id: Date.now(),
    customerName: data.customerName,
    phone: data.phone,
    carMake: data.carMake,
    carModel: data.carModel,
    carYear: data.carYear,
    problemType: data.problemType,
    description: data.description,
    address: data.address,
    urgency: data.urgency,
    status: "Pending",
    assignedTo: null,
    createdAt: new Date().toISOString()
  };

  // Save request in temporary array
  requests.push(newRequest);

  // Send response back to frontend
  res.status(201).json({
    message: "Request created successfully",
    request: newRequest
  });
});

// ------------------------------
// PATCH /requests/:id/status
// ------------------------------

// This route updates the status of a request
// Example statuses: Accepted, Rejected, In Progress, Completed
app.patch("/requests/:id/status", function (req, res) {
  const requestId = Number(req.params.id);
  const newStatus = req.body.status;

  // Allowed statuses
  const allowedStatuses = [
    "Pending",
    "Accepted",
    "Rejected",
    "In Progress",
    "Completed",
    "Cancelled"
  ];

  if (!newStatus || !allowedStatuses.includes(newStatus)) {
    return res.status(400).json({
      message: "Invalid status"
    });
  }

  // Find request by id
  const request = requests.find(function (item) {
    return item.id === requestId;
  });

  if (!request) {
    return res.status(404).json({
      message: "Request not found"
    });
  }

  // Update request status
  request.status = newStatus;

  res.json({
    message: "Status updated successfully",
    request: request
  });
});

// ------------------------------
// Optional: DELETE /requests/:id
// ------------------------------

// This is useful during testing
app.delete("/requests/:id", function (req, res) {
  const requestId = Number(req.params.id);

  const originalLength = requests.length;

  requests = requests.filter(function (item) {
    return item.id !== requestId;
  });

  if (requests.length === originalLength) {
    return res.status(404).json({
      message: "Request not found"
    });
  }

  res.json({
    message: "Request deleted successfully"
  });
});

// ------------------------------
// Start server
// ------------------------------

app.listen(PORT, function () {
  console.log(`MobMec backend is running on http://localhost:${PORT}`);
});