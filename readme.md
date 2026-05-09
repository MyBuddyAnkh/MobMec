# MobMec - Mobile Mechanic Service Platform

MobMec is a web-based mobile mechanic service platform designed to connect customers who need roadside or vehicle assistance with nearby mechanics or helpers. The idea of this project is similar to an “Uber-style” system, but for car-related services such as flat tires, battery jump starts, engine issues, minor inspections, and emergency roadside support.

The main goal of this project is to make it easier for customers to request help when they are facing a vehicle problem. Instead of searching for a mechanic manually or calling multiple shops, customers can create a service request by entering their vehicle details, problem type, description, location, and urgency level. Mechanics or helpers can then view available requests and accept or reject jobs based on their availability and skill level.

This project is currently in the early development stage. I am building it step by step to improve my practical skills in frontend development, backend development, databases, Git/GitHub, and full-stack project structure.

## Project Purpose

The purpose of MobMec is to create a real-world style application that solves a practical problem in the automotive service industry. It is also being built as a portfolio project to demonstrate important software development concepts such as:

- Customer request forms
- User roles
- Service request tracking
- Mechanic/helper dashboard
- Admin dashboard
- Status updates
- Database storage
- Backend API communication
- Git and GitHub version control
- Future deployment to a live server

## Main User Roles

The project will include three main types of users:

### 1. Customer

Customers will be able to create service requests when they need help with their car. They can enter details such as their name, vehicle information, problem category, description, address, and urgency.

### 2. Mechanic / Helper

Mechanics or helpers will be able to view open service requests. They can accept or reject jobs and update the status of a request.

Some jobs may require a professional mechanic, while smaller jobs such as a tire change or battery boost may be handled by a helper.

### 3. Admin

The admin will be able to manage the overall system, view all service requests, track completed and pending jobs, and monitor platform activity.

## Current Features

At the current stage, the project is focused on the basic frontend structure. The first version includes:

- Basic HTML structure
- Customer service request form
- Fields for customer and vehicle details
- Problem type selection
- Description input
- Simple page layout
- Separate CSS and JavaScript files
- GitHub version control setup

## Planned Features

Over the next few days, I plan to add more features and improve the project step by step.

### Frontend Improvements

I will improve the design of the website by adding better styling, layout, colors, spacing, and responsive design for mobile and desktop screens. The goal is to make the website look more professional and easier to use.

### JavaScript Functionality

I will add JavaScript functionality so that when a customer submits a request, the request can be displayed on the page immediately. This will make the project more interactive and help simulate how real service requests would work.

### Service Request Cards

I plan to show each submitted request as a card. Each card will display important information such as:

- Customer name
- Vehicle details
- Problem type
- Description
- Urgency level
- Current status

### Mechanic Dashboard

I will add a mechanic/helper dashboard where open service requests can be viewed. Mechanics will be able to accept or reject a request.

### Request Status System

I will add a basic status system for each request. Example statuses include:

- Pending
- Accepted
- In Progress
- Completed
- Cancelled

### Admin Dashboard

I plan to create an admin dashboard that shows basic platform information such as:

- Total requests
- Pending requests
- Accepted jobs
- Completed jobs
- Most common problem types

### Backend API

After completing the basic frontend, I plan to add a backend using Node.js and Express. The backend will handle service request creation, request updates, and communication between the frontend and database.

### Database Integration

I plan to use a SQL database such as PostgreSQL or MySQL to store user details, vehicle information, service requests, assignments, and reviews.

### Authentication

In a later version, I plan to add login and signup functionality for customers, mechanics, helpers, and admins.

### Monitoring Script

I also plan to add a simple Python monitoring script that checks for delayed service requests and generates basic alerts or logs. This will help add an IT/infrastructure-style feature to the project.

## Future Technology Stack

The planned technology stack for this project is:

- HTML
- CSS
- JavaScript
- React
- Node.js
- Express.js
- PostgreSQL or MySQL
- Python for monitoring script
- Git and GitHub
- Deployment on a cloud/server platform

## Long-Term Goal

The long-term goal of MobMec is to become a complete full-stack project where customers can request mobile mechanic help, mechanics can manage jobs, and admins can monitor all platform activity.

This project will help me practice real software development skills, including frontend design, backend APIs, database design, version control, and deployment.
