# Finance Dashboard Backend

A backend system for managing financial records with role-based access control and analytics. This project simulates a real-world finance tracking system with secure APIs, structured data handling, and analytical insights.

---

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

### Roles & Permissions

| Role       | Permissions                          |
| ---------- | ------------------------------------ |
| VIEWER     | View records only                    |
| ANALYST    | View records + analytics             |
| ADMIN      | Full access (CRUD + user management) |
| SUPERADMIN | Full control over all roles          |

---

## 🔄 Role Assignment Flow

* Default role assigned during registration → `VIEWER`
* Admin can update user roles using API
* SuperAdmin can override all roles

---

## 👤 User Management

* Admin can view all users
* Admin can update roles and activation status
* Supports active/inactive user control

### Example Response

```json
{
 "id": "user123",
 "email": "user@example.com",
 "role": "ANALYST",
 "isActive": true
}
```

---

## 🚫 User Activation System

* Inactive users cannot login
* Inactive users cannot access protected APIs
* Enforced at both login and middleware levels

---

## 🔐 Features

### Authentication & Authorization

* User registration and login
* Password hashing using bcrypt
* JWT-based authentication
* Role-Based Access Control (RBAC)
  
  * VIEWER → read-only access
  * ANALYST → analytics access
  * ADMIN → full access
  * SUPER ADMIN → THE BOSS

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
* Validates:

  * request body (records, auth)
  * query parameters (summary)
* Prevents invalid or malformed API requests

---

## 📡 API Endpoints
### Authentication

* `POST /api/auth/register`
* `POST /api/auth/login`

---

### Users (Admin Only)

* `GET /api/users`
* `PATCH /api/users/:id`

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

## ⚠️ Edge Case Handling

* Prevents cross-user data access
* Handles inactive users
* Case-insensitive search
* Soft delete consistency
* Input validation for all endpoints

---

## 🔐 Security Considerations

* JWT authentication
* Password hashing
* RBAC middleware
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

* Rate limiting not implemented (can be added for production)
* Unit tests not included due to scope
* JWT used instead of session-based authentication

---

## 📌 Assumptions

* Users access only their own records
* Date filtering requires both start and end date
* Single currency system
* No third-party integrations

---

## 🔮 Future Improvements

* Rate limiting
* Swagger API documentation
* Unit and integration tests
* Redis caching
* Refresh tokens


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

### 📊 4. Summary (Analytics)

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
    "monthlyTrends": {...},
    "weeklyTrends": {...}
  }
}
```

---

### 📄 5. Get Records (Pagination + Filters)

```bash
GET /api/records?type=EXPENSE&search=food&page=1&limit=2
Authorization: Bearer ANALYST_TOKEN
```

```json
{
  "success": true,
  "data": [...],
  "meta": {
    "total": 10,
    "page": 1,
    "limit": 2,
    "totalPages": 5
  }
}
```

---

### 🔍 6. Advanced Query (Date + Sorting)

```bash
GET /api/records?startDate=2026-04-01&endDate=2026-04-30&sort=amount&order=desc
Authorization: Bearer ANALYST_TOKEN
```

✔ Demonstrates:

* Date filtering
* Sorting
* Real-world usage

---

### 🕒 7. Recent Activity

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
      "category": "Food",
      "createdAt": "..."
    }
  ]
}
```

---

### 🧾 8. Create Record

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

### ❌ 9. Unauthorized (No Token)

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

### ⛔ 10. Forbidden (RBAC)

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

### 🚫 11. Inactive User

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

### ❌ 12. Validation Error

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
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

### Run

```bash
npx prisma migrate dev
npm run dev
```

---

## 🎯 Conclusion

This project demonstrates backend engineering concepts such as secure API design, authentication, authorization, validation, data modeling, and analytical processing aligned with real-world fintech applications.
