# Finance Dashboard Backend

A backend system for managing financial records with role-based access control and analytics.

## Tech Stack

- Node.js + Express
- TypeScript
- PostgreSQL (Neon)
- Prisma ORM
- JWT Authentication

## Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Viewer, Analyst, Admin)

### Financial Records
- Create, update, delete records
- Soft delete support
- Filtering by type and category
- Pagination and search

### Dashboard Summary
- Total income and expenses
- Balance calculation
- Category-wise breakdown
- Monthly trends
- Date range filtering

## API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login

### Records
- POST /api/records
- GET /api/records
- PUT /api/records/:id
- DELETE /api/records/:id

### Summary
- GET /api/summary

## Setup Instructions

1. Clone repository
2. Install dependencies
   npm install
3. Add .env file
   DATABASE_URL=your_database_url
   JWT_SECRET=your_secret
4. Run migrations
   npx prisma migrate dev
5. Start server
   npm run dev
