# Integrated Resort Management System

Integrated Resort Management System is a full-stack web application for managing resort operations in one place: room booking, approvals, billing, invoices, payments, notifications, and expense tracking.

## Highlights

- Public booking flow for guests
- Admin login and booking approval dashboard
- Invoice generation and billing views
- Payment and notification modules
- Owner/Admin expense tracking panel
- Responsive React UI with modern layouts

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB (Mongoose), plus demo/local data helpers in codebase
- Auth: JWT-based authentication

## Project Structure

```text
Billing system/
  backend/     # Express API, models, routes, controllers
  frontend/    # React app (Vite)
  scripts/     # helper scripts
```

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/farxi36-sys/Integrated-Resort-Management-System.git
cd "Integrated-Resort-Management-System"
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` (you can copy from `.env.example`) and set at least:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
GST_RATE=0.12
```

Start backend:

```bash
npm start
```

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on Vite dev server and talks to backend at `http://localhost:5000`.

## Main Modules

- Booking Management
- Room Management
- Invoices and Payments
- Notifications
- Dashboard Analytics
- Expense Management

## API Overview

Some important endpoints:

- `POST /auth/login`
- `POST /booking/create`
- `GET /booking/pending`
- `GET /invoice/list`
- `POST /invoice/generate`
- `POST /payment/add`
- `GET /dashboard/stats`

## Screenshots

Add screenshots in this section for a better GitHub page preview.

Recommended screenshots:

- Public landing page
- Booking page
- Admin login page
- Admin dashboard
- Invoices page
- Expense tracking page

## Future Improvements

- Role-based permission expansion
- Better reports and export features
- Cloud deployment (frontend + backend)
- Automated tests (unit/integration)

## Author

Developed by Farxi36
