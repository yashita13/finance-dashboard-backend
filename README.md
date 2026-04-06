# Finance Dashboard Backend

A backend system for managing financial records with role-based access control and analytics. This project simulates a real-world finance tracking system with secure APIs, structured data handling, and analytical insights.

---

## API Documentation

Postman Collection: https://documenter.getpostman.com/view/45527070/2sBXiqDoHU

This collection contains all API endpoints including authentication, user management, and transactions.


## Key Highlights
* Modular **service-controller architecture**
* **RBAC with user management** (role updates + activation control)
* Clear **role assignment flow** (default + admin updates)
* **Active/inactive user access control** (login + middleware)
* **Recent activity API** for latest records
* Built-in analytics (**income/expense, monthly & weekly trends**)
* Supports **pagination, search, filtering, date-range, and sorting**
* **Zod validation** and **centralized error handling**
* **Soft delete** with consistent data filtering
* Demonstrates **analyst access to analytics endpoints**

---

## 🏗️ Architecture

```text
Client
  ↓
Routes
  ↓
Validation (Zod)
  ↓
Authentication (JWT)
  ↓
Authorization (RBAC)
  ↓
Controllers (Request Handling)
  ↓
Services (Business Logic)
  ↓
Prisma ORM (Data Access Layer)
  ↓
PostgreSQL (Database)

Error Handling → Centralized Middleware
```


## 🔄 Request Flow Example

1. User sends request with JWT token  
2. Authentication middleware verifies token  
3. RBAC middleware checks user role  
4. Controller handles request  
5. Service layer processes business logic  
6. Prisma interacts with database  
7. Response returned in standardized format 

---

## 🚀 Tech Stack

| Layer          | Technology          |
| -------------- | ------------------- |
| Backend        | Node.js, Express.js |
| Language       | TypeScript          |
| Database       | PostgreSQL (Neon)   |
| ORM            | Prisma              |
| Authentication | JWT                 |
| Validation     | Zod                 |
| API Testing    | Postman             |

---

## 🔐 Role-Based Access Control

### Role Hierarchy
**SUPER_ADMIN > ADMIN > ANALYST > VIEWER**

### Roles & Permissions

| Role | Permissions |
| --- | --- |
| **VIEWER** | Read-only access <br/> Can request upgrade to ANALYST |
| **ANALYST** | Can CREATE (POST) records <br/> Can view analytics <br/> ❌ Cannot EDIT or DELETE any records |
| **ADMIN** | Full CRUD access on all records <br/> Can manage users <br/> Can approve/reject access requests |
| **SUPER_ADMIN** | Full system control <br/> Can override all permissions |

### Explicit RBAC Enforcement Rules

| Action | Allowed Roles |
| --- | --- |
| **CREATE_RECORD** | ANALYST, ADMIN, SUPER_ADMIN |
| **UPDATE_RECORD** | ADMIN, SUPER_ADMIN |
| **DELETE_RECORD** | ADMIN, SUPER_ADMIN |
| **REQUEST_ACCESS** | VIEWER |
| **APPROVE_REQUEST** | ADMIN, SUPER_ADMIN |
| **MANAGE_USERS** | ADMIN, SUPER_ADMIN |
| **FULL_ACCESS** | SUPER_ADMIN |

---

## 🔄 Role Assignment Flow

* Default role assigned during registration → `VIEWER`
* Admin can update user roles using API
* SUPER_ADMIN can override all roles

---

## 👤 User Management & Access Requests

* Admin can view all users, update roles, and modify activation status.
* Supports active/inactive user control.

### Automated Access Request System

**Flow:** Viewer → Request → Admin/SuperAdmin → Approve → Becomes Analyst

* **Duplicate request prevention:** The system strictly blocks users from submitting multiple pending requests.
* **Status states:** Requests exist globally either as `PENDING`, `APPROVED`, or `REJECTED`.
* `VIEWER` users can submit requests directly from the UI to elevate their rank to Analyst.
* `ADMIN` and `SUPER_ADMIN` have a dedicated dashboard to approve or reject these requests seamlessly.

---

## 🗄️ Prisma Model

### AccessRequest Schema
```prisma
model AccessRequest {
  id            String   @id @default(uuid())
  userId        String
  requestedRole String
  status        String
  createdAt     DateTime @default(now())

  user User @relation(fields: [userId], references: [id])
}
```

---

## 🚫 User Activation System

* Inactive users cannot login
* Inactive users cannot access protected APIs
* Enforced at both login and middleware levels

---

## 🔐 Features

### 🎨 Frontend UI / Neo-Glassmorphism Dashboard
* **Dynamic Analytics**: Visualizes data natively through interactive charts (income vs expense) and trend graphs (monthly/weekly).
* **Premium Aesthetics**: Features a modern "neo-glassmorphism" design with deep purples, glowing shadows, frosted glass panels, and blurred backdrops.
* **Role-Based UI Rendering**:
  * **Analyst** → sees "Add Record" button only.
  * **Viewer** → sees "Request Access" button.
  * **Admin / SUPER_ADMIN** → see the approval dashboard and complete management access.
* **Smart Contextual Layouts**: Implements strict conditional rendering based on exact permissions—disabling unauthorized row-level actions visually across tables to protect data boundaries.

---

### Authentication & Authorization

* User registration and login
* Password hashing using bcrypt
* JWT-based authentication
* Role-Based Access Control (RBAC)

---

### 📊 Financial Records

* Create, update, delete records
* Soft delete (isDeleted flag)
* Filter records:
  * by type (INCOME / EXPENSE)
  * by category
  * by date range
* Pagination support (`page`, `limit`)
* Search functionality (case-insensitive)
* Sorting (amount, date)

---

### 📈 Dashboard Summary

* Total income and expenses
* Net balance calculation
* Category-wise breakdown (income vs expense)
* Monthly trends (income vs expense per month)
* Weekly trends
* Date range filtering

---

### 🧩 Advanced Features Implemented
* Pagination (page & limit)  
* Case-insensitive search  
* Multi-field filtering (type, category) 
* Sorting support
* Date-range filtering
* Soft delete with consistent exclusion  
* Aggregation-based analytics  
* Monthly+ weekly trend computation  
* Category-wise income vs expense mapping  

---

### ✅ Validation (Zod)

* Input validation using Zod schemas
* Validates request body and query parameters
* Prevents invalid or malformed API requests

---

## 📡 API Endpoints

### Authentication
* `POST /api/auth/register`
* `POST /api/auth/login`

---

### Users & Access Requests (Admin Only)
* `GET /api/users`
* `PATCH /api/users/:id`
* `POST /api/access-requests` (VIEWER only)
* `GET /api/access-requests`
* `PATCH /api/access-requests/:id/approve`
* `PATCH /api/access-requests/:id/reject`

---

### Records
* `POST /api/records`
* `GET /api/records`
* `GET /api/records/recent`
* `PUT /api/records/:id`
* `DELETE /api/records/:id`

---

### Summary
* `GET /api/summary`

---

## 🔍 Query Capabilities

### Filtering
```
GET /api/records?type=INCOME&category=Food
```

### Date Filtering
```
GET /api/records?startDate=2026-04-01&endDate=2026-04-30
```

### Sorting
```
GET /api/records?sort=amount&order=desc
```

---

## 📡 Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Created               |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 500  | Internal Server Error |

---

## 📊 Analyst Access Example

```
GET /api/summary
Authorization: Bearer ANALYST_TOKEN
```

Response: Allowed

---

## 📡 API Examples (Detailed)

---

### 🔐 1. Login (Authentication)

#### Request
```bash
POST /api/auth/login
```

#### Body
```json
{
  "email": "admin@test.com",
  "password": "123456"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "token": "JWT_TOKEN"
  }
}
```

---

### 👤 2. Get All Users (Admin Only)

```bash
GET /api/users
Authorization: Bearer ADMIN_TOKEN
```

```json
{
  "success": true,
  "data": [
    {
      "id": "user123",
      "email": "user@test.com",
      "role": "ANALYST",
      "isActive": true
    }
  ]
}
```

---

### 🔄 3. Update User Role / Status

```bash
PATCH /api/users/:id
Authorization: Bearer ADMIN_TOKEN
```

```json
{
  "role": "ANALYST",
  "isActive": false
}
```

---

### 🛡️ 4. Access Requests System

#### Create Request (Viewer)
```bash
POST /api/access-requests
Authorization: Bearer VIEWER_TOKEN
```
```json
{
  "success": true,
  "data": { "id": "req_123", "status": "PENDING" }
}
```

#### Approve Request (Admin)
```bash
PATCH /api/access-requests/req_123/approve
Authorization: Bearer ADMIN_TOKEN
```
```json
{
  "success": true,
  "data": { "id": "req_123", "status": "APPROVED", "requestedRole": "ANALYST" }
}
```

---

### 📊 5. Summary (Analytics)

```bash
GET /api/summary
Authorization: Bearer ANALYST_TOKEN
```

```json
{
  "success": true,
  "data": {
    "totalIncome": 150000,
    "totalExpense": 7000,
    "balance": 143000,
    "monthlyTrends": {},
    "weeklyTrends": {}
  }
}
```

---

### 📄 6. Get Records (Pagination + Filters)

```bash
GET /api/records?type=EXPENSE&search=food&page=1&limit=2
Authorization: Bearer ANALYST_TOKEN
```

```json
{
  "success": true,
  "data": [],
  "meta": {
    "total": 10,
    "page": 1,
    "limit": 2,
    "totalPages": 5
  }
}
```

---

### 🔍 7. Advanced Query (Date + Sorting)

```bash
GET /api/records?startDate=2026-04-01&endDate=2026-04-30&sort=amount&order=desc
Authorization: Bearer ANALYST_TOKEN
```

✔ Demonstrates:
* Date filtering
* Sorting
* Real-world usage

---

### 🕒 8. Recent Activity

```bash
GET /api/records/recent?limit=3
Authorization: Bearer ANALYST_TOKEN
```

```json
{
  "success": true,
  "data": [
    {
      "amount": 500,
      "category": "Food"
    }
  ]
}
```

---

### 🧾 9. Create Record

```bash
POST /api/records
Authorization: Bearer ANALYST_TOKEN
```

```json
{
  "amount": 1000,
  "type": "INCOME",
  "category": "Salary",
  "date": "2026-04-04"
}
```

---

### ❌ 10. Unauthorized (No Token)

```bash
GET /api/records
```

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

### ⛔ 11. Forbidden (RBAC)

```bash
DELETE /api/records/:id
Authorization: Bearer VIEWER_TOKEN
```

```json
{
  "success": false,
  "message": "Forbidden"
}
```

---

### 🚫 12. Inactive User

```bash
POST /api/auth/login
```

```json
{
  "success": false,
  "message": "User is inactive"
}
```

---

### ❌ 13. Validation Error

```json
{
  "success": false,
  "message": "Validation error"
}
```

---

## ⚙️ Setup Instructions

```bash
git clone <repo-url>
cd finance-dashboard-backend
npm install
```

### Environment

```
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

### Run

```bash
npx prisma migrate dev
npm run dev
```

---

## ⚠️ Edge Case Handling

* Prevents cross-user data access
* Handles inactive users
* Case-insensitive search
* Soft delete consistency
* Input validation for all endpoints

---

## 🔐 Security Considerations

* Strict RBAC enforcement at backend
* Prevents unauthorized record creation
* Ensures VIEWER cannot access protected mutation routes
* JWT authentication
* Password hashing
* Input validation (Zod)
* Protected routes

---

## 🧠 Design Approach

* Layered architecture (Controller → Service → ORM)
* Prisma for maintainable database interaction
* PostgreSQL for structured financial data
* JWT for stateless authentication
* RBAC for secure role-based access
* Focus on scalability and clean code

---

## ⚖️ Trade-offs

* Rate limiting can be added for production use.
* Unit tests not included due to scope
* JWT used instead of session-based authentication

---

## 📌 Assumptions

* Users operate strictly within their RBAC permission bounds
* Date filtering requires both start and end date
* Single currency system
* No third-party integrations

---

## 🔮 Future Improvements

* Rate limiting
* Swagger API documentation (Postman api documentation done)
* Unit and integration tests
* Redis caching
* Refresh tokens

---

## 🎯 Conclusion

This project demonstrates backend engineering concepts such as secure API design, authentication, authorization, validation, data modeling, and analytical processing aligned with real-world fintech applications. The framework bridges complete backend solidity with hierarchical RBAC, controlled privilege escalation, and secure role-based workflows driven securely by strict access management similar to enterprise real-world SaaS systems.
