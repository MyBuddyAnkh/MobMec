# MobMec / FixMyRide

A full-stack mobile mechanic and roadside assistance request platform. The project allows customers to submit vehicle service requests and lets a mechanic/admin-style dashboard view and update request statuses.

This project is built as a clean MVP so recruiters can quickly test the core workflow without needing to create an account or go through a login process.

---

## Project Overview

MobMec, also shown as FixMyRide in the UI, is designed for drivers who need fast roadside help such as tire changes, battery boosts, fuel assistance, lockout support, basic diagnostics, or minor repairs.

The main goal of this project is to demonstrate a complete full-stack flow:

1. A customer submits a service request from the frontend.
2. The request is sent to a Node.js and Express backend.
3. The backend saves the request in a PostgreSQL database.
4. The frontend loads saved requests from the backend.
5. Request status can be updated from the dashboard.

---

## Why There Is No Login Yet

Login and signup are intentionally not included in this MVP.

For recruiter testing, this makes the project faster to review:

- No account creation required
- No test credentials needed
- The request form and dashboard can be tested immediately
- The main full-stack functionality is visible right away

Authentication is planned as a future improvement, but it was intentionally skipped in the first version to keep the demo simple and easy to evaluate.

---

## Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Express.js
- CORS
- dotenv

### Database

- PostgreSQL
- node-postgres (`pg`)

---

## Current Features

- Responsive landing page for a mobile mechanic service
- Service request form
- Form validation
- PostgreSQL database storage
- Live service requests dashboard
- View all submitted service requests
- Update request status
  - Pending
  - Accepted
  - Rejected
  - Completed
- Contact form UI
- REST API backend

---

## Core User Flow

```text
Customer fills service request form
↓
Frontend sends request to backend API
↓
Express server validates request data
↓
PostgreSQL stores the request
↓
Frontend fetches saved requests
↓
Dashboard displays request cards
↓
Status buttons update request status
```

---

## Folder Structure

```text
MobMec/
├── index.html
├── style.css
├── script.js
├── README.md
└── backend/
    ├── server.js
    ├── db.js
    ├── schema.sql
    ├── package.json
    ├── package-lock.json
    └── .env
```

> Note: `node_modules/` is generated after running `npm install` and does not need to be written manually.

---

## API Routes

| Method | Route | Description |
|---|---|---|
| GET | `/` | Test route to confirm backend is running |
| GET | `/requests` | Get all service requests |
| POST | `/requests` | Create a new service request |
| PATCH | `/requests/:id/status` | Update request status |
| DELETE | `/requests/:id` | Delete a request for testing/cleanup |

---

## Request Data Model

The project uses this main request model:

```js
{
  id,
  customerName,
  customerPhone,
  vehicleMake,
  vehicleModel,
  vehicleYear,
  serviceType,
  customerLocation,
  problemDescription,
  urgency,
  status,
  createdAt
}
```

---

## PostgreSQL Table

The main table is `requests`.

```sql
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
```

---

## How to Run the Project Locally

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd MobMec
```

### 2. Set Up PostgreSQL

Create a PostgreSQL database named:

```text
mobmec_db
```

Then run the SQL inside:

```text
backend/schema.sql
```

You can run it using pgAdmin Query Tool or the PostgreSQL terminal.

### 3. Configure Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=mobmec_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
```

Replace `your_postgres_password` with your actual PostgreSQL password.

### 4. Install Backend Dependencies

```bash
cd backend
npm install
```

### 5. Start the Backend Server

```bash
npm run dev
```

Expected output:

```text
Connected to PostgreSQL database
MobMec backend running on http://localhost:5000
```

Open this URL in the browser to test the backend:

```text
http://localhost:5000
```

To test all saved requests:

```text
http://localhost:5000/requests
```

### 6. Start the Frontend

Open `index.html` with VS Code Live Server.

Example frontend URL:

```text
http://127.0.0.1:5500/index.html
```

---

## Testing Checklist

Use this checklist to confirm the project is working:

- Start PostgreSQL
- Start backend with `npm run dev`
- Open frontend with Live Server
- Submit a service request
- Confirm the request appears in the dashboard
- Refresh the page
- Confirm the request is still visible
- Click `Accept`, `Reject`, or `Complete`
- Refresh again
- Confirm the updated status is still saved
- Run `SELECT * FROM requests;` in PostgreSQL and confirm the row exists

---

## Example Test Data

```text
Name: Test User
Phone: 1234567890
Vehicle Make: Toyota
Vehicle Model: Camry
Vehicle Year: 2010
Service Type: Battery Boost
Urgency: High
Location: Richmond Hill
Problem Description: Car battery is dead and the vehicle will not start.
```

---

## Future Improvements

The current version focuses on the core full-stack MVP. These features can be added later:

- User login and signup
- Separate customer and mechanic dashboards
- Admin dashboard
- Google Maps integration
- Location-based mechanic matching
- Real-time status updates with WebSockets
- Mechanic profile pages
- Ratings and reviews
- Payment integration
- Email/SMS notifications
- Request history for customers
- Deployment with hosted frontend, backend, and database
- React frontend upgrade

---

## Project Status

MVP development focus:

```text
Landing page: Complete
Request form: Complete
Backend API: Complete
PostgreSQL integration: Complete
Dashboard display: Complete
Status update flow: Complete
Login/authentication: Planned future improvement
Maps/payment/realtime tracking: Planned future improvement
```

---

## Resume Summary

Built a full-stack mobile mechanic and roadside assistance request platform using HTML, CSS, JavaScript, Node.js, Express.js, and PostgreSQL. The platform allows users to create vehicle service requests, stores request data in a PostgreSQL database, and provides a dashboard to view and update request statuses through REST APIs.

---

## Author

Created by Anmol Khurmi.
