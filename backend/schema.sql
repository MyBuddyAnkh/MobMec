CREATE TABLE IF NOT EXISTS requests (
    id SERIAL PRIMARY KEY,

    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,

    vehicle_make VARCHAR(100),
    vehicle_model VARCHAR(100),
    vehicle_year INTEGER,

    service_type VARCHAR(100) NOT NULL,
    customer_location TEXT NOT NULL,
    problem_description TEXT NOT NULL,

    urgency VARCHAR(50) DEFAULT 'Medium',

    status VARCHAR(50) DEFAULT 'Pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);