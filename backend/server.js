const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let requests = [];

// Test route
app.get("/", function (req, res) {
    res.send("MobMec backend is running");
});

// GET all requests
app.get("/requests", function (req, res) {
    res.json(requests);
});

// POST new request
app.post("/requests", function (req, res) {
    const newRequest = {
        id: Date.now(),
        customerName: req.body.customerName,
        customerPhone: req.body.customerPhone,
        vehicleMake: req.body.vehicleMake,
        vehicleModel: req.body.vehicleModel,
        vehicleYear: req.body.vehicleYear,
        serviceType: req.body.serviceType,
        customerLocation: req.body.customerLocation,
        problemDescription: req.body.problemDescription,
        status: "Pending",
        createdAt: new Date().toLocaleString()
    };

    requests.push(newRequest);

    res.status(201).json({
        message: "Request created successfully",
        request: newRequest
    });
});

// PATCH request status
app.patch("/requests/:id/status", function (req, res) {
    const requestId = Number(req.params.id);
    const newStatus = req.body.status;

    const request = requests.find(function (item) {
        return item.id === requestId;
    });

    if (!request) {
        return res.status(404).json({
            message: "Request not found"
        });
    }

    request.status = newStatus;

    res.json({
        message: "Request status updated",
        request: request
    });
});

app.listen(PORT, function () {
    console.log("Server running on http://localhost:" + PORT);
});