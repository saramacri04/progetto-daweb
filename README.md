# EcoMarket - Sustainable Second-Hand Marketplace

**Course:** Desarrollo de Aplicaciones Web (2025/2026)

## Project Overview
EcoMarket is a modern, responsive, full-stack web application designed to promote the circular economy. The platform enables users to securely buy and sell second-hand products. By facilitating the reuse of goods, EcoMarket aims to reduce waste and encourage sustainable consumption habits within local communities.

## Architecture & Technology Stack
The system is built using a decoupled client-server architecture based on REST APIs:

### Frontend (SPA)
- **Framework:** React 19 + Vite 8
- **Routing:** React Router DOM v7
- **Styling:** Bootstrap 5.3 + Custom CSS (featuring responsive CSS Grid layouts)
- **HTTP Client:** Axios (handling JSON and `multipart/form-data`)
- **State Management:** React Context API for global authentication state

### Backend (REST API + SSR)
- **Runtime Environment:** Node.js + Express 5
- **Database:** MySQL (using `mysql2/promise` with connection pooling)
- **Authentication:** `express-session` combined with `bcrypt` for secure password hashing
- **File Management:** `multer` for processing multipart form data (product images)
- **Admin Interface:** Server-Side Rendered views using Handlebars (`.hbs`)

## Features
- **User Authentication:** Secure registration and login flow using server-side sessions and HttpOnly cookies.
- **Product Management:** Authenticated users can list products, upload up to 5 images (selecting a primary cover), edit details, and delete listings.
- **Advanced Catalog & Search:** Public catalog featuring pagination, textual search, and filtering by category, condition, and price.
- **Transaction System:** Buyers can send purchase requests. Sellers manage incoming requests, accepting or rejecting them through a dedicated dashboard.
- **Review System:** Post-transaction, buyers and sellers can rate each other (1-5 stars) and leave comments to build community trust.
- **Dual Interface:** A React SPA for standard users and a secure, Server-Side Rendered Handlebars interface for administrators to monitor users and transactions.

## Setup Instructions
The project consists of two separate environments that must run concurrently.

### 1. Database Preparation
Ensure MySQL is running, then initialize the database:
```bash
cd backend
mysql -u root -e "CREATE DATABASE IF NOT EXISTS eco_market;"
mysql -u root eco_market < schema.sql
node seed.js # (Optional) Populate with demo data
```

### 2. Start the Backend
Configure your `.env` file (DB credentials, session secret), install dependencies, and start the Express server:
```bash
cd backend
npm install
node server.js
```
*The backend runs on `http://localhost:3000`.*

### 3. Start the Frontend
In a separate terminal, install the dependencies and start the Vite development server:
```bash
cd frontend
npm install
npm run dev
```
*The frontend runs on `http://localhost:5173`. The Vite proxy is configured to automatically route `/api/*` requests to the backend, circumventing CORS issues during development.*

## Documentation
- `MemoriaDaWeb_EcoMarket.pdf`: The official project report detailing the system requirements, UI/UX design, and database schema.
