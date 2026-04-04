# Finance Dashboard Backend

A backend system for managing financial records with role-based access control and analytics. This project simulates a real-world finance tracking system with secure APIs, structured data handling, and analytical insights.

---

## Key Highlights
* Built using modular service-controller architecture  
* Implemented soft delete with consistent filtering  
* Designed analytics engine  
* Integrated Zod validation middleware  
* Enforced RBAC using middleware  
* Supports pagination, search, and multi-filter queries

---

## 🚀 Tech Stack

* **Backend:** Node.js, Express.js
* **Language:** TypeScript
* **Database:** PostgreSQL (Neon)
* **ORM:** Prisma
* **Authentication:** JWT (JSON Web Token)
* **Validation:** Zod
* **API Testing:** Postman

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

---

### 📊 Financial Records

* Create, update, delete records
* Soft delete (isDeleted flag)
* Filter records:

  * by type (INCOME / EXPENSE)
  * by category
* Pagination support (`page`, `limit`)
* Search functionality (case-insensitive)

---

### 📈 Dashboard Summary

* Total income and expenses
* Net balance calculation
* Category-wise breakdown (income vs expense)
* Monthly trends (income vs expense per month)
* Date range filtering

---

### 🧩 Advanced Features Implemented
* Pagination (page & limit)  
* Case-insensitive search  
* Multi-field filtering (type, category)  
* Soft delete with consistent exclusion  
* Aggregation-based analytics  
* Monthly trend computation  
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

### 🔑 Authentication

All protected routes require:
* Authorization: Bearer <JWT_TOKEN>

### 🔐 Auth

* `POST /api/auth/register`

* `POST /api/auth/login`

---

### 📊 Records

* `POST /api/records` → Create record
* `GET /api/records` → Fetch records
* `PUT /api/records/:id` → Update record
* `DELETE /api/records/:id` → Soft delete

#### Query Parameters

* `type=INCOME`
* `category=Food`
* `page=1&limit=5`
* `search=food`

---

### 📈 Summary

* `GET /api/summary`

#### Query Parameters

* `startDate=YYYY-MM-DD`
* `endDate=YYYY-MM-DD`


---

## 🔐 Authentication & RBAC Examples


### 🔑 Login (Generate Token)

#### Request

```bash id="d3k7x1"
POST /api/auth/login
```

#### Body

```json id="a8f2pz"
{
  "email": "admin@example.com",
  "password": "password123"
}
```

#### Response

```json id="m7l2qa"
{
  "success": true,
  "data": {
    "token": "JWT_TOKEN_HERE"
  }
}
```

---

### 🔒 Access Protected Route

#### Request

```bash id="v2k9sd"
GET /api/records
```

#### Headers

```text id="k3z8pt"
Authorization: Bearer JWT_TOKEN_HERE
```

#### Response

```json id="r4x1bn"
{
  "success": true,
  "data": [...]
}
```

---

### ❌ Unauthorized Access (No Token)

#### Request

```bash id="z7y6dm"
GET /api/records
```

#### Response

```json id="p5h3lk"
{
  "success": false,
  "message": "Unauthorized"
}
```

---

### ⛔ Forbidden Access (Role-Based)

#### Example: Viewer trying to delete record

#### Request

```bash id="t9w4ju"
DELETE /api/records/:id
```

#### Headers

```text id="c2n8yx"
Authorization: Bearer VIEWER_TOKEN
```

#### Response

```json id="q6v1em"
{
  "success": false,
  "message": "Forbidden"
}
```

---

## 📡 API Examples (Detailed)


### 📊 1. Summary API (Analytics Engine)

#### Request

```bash
GET /api/summary
```

#### Response

```json
{
  "success": true,
  "data": {
    "totalIncome": 150000,
    "totalExpense": 7000,
    "balance": 143000,
    "categoryBreakdown": {
      "Salary": {
        "income": 100000,
        "expense": 0
      },
      "Food": {
        "income": 0,
        "expense": 2000
      },
      "Travel": {
        "income": 0,
        "expense": 3000
      },
      "Freelance": {
        "income": 50000,
        "expense": 0
      },
      "food": {
        "income": 0,
        "expense": 2000
      }
    },
    "monthlyTrends": {
      "2026-04": {
        "income": 100000,
        "expense": 4000
      },
      "2026-05": {
        "income": 50000,
        "expense": 3000
      }
    }
  }
}
```

#### 🔍 Features Demonstrated

* Aggregation logic
* Category-wise analytics
* Monthly trend analysis
* Handles inconsistent category casing (Food vs food)
* Soft-delete aware calculations

---

### 📊 2. Get All Records

#### Request

```bash
GET /api/records
```

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "4cd91f4c-ba3b-4666-8b13-569ce6c63e8f",
      "amount": 50000,
      "type": "INCOME",
      "category": "Freelance",
      "date": "2026-05-10T00:00:00.000Z"
    },
    {
      "id": "2904ab5e-989c-440f-9345-6c7b0d0e1ddb",
      "amount": 2000,
      "type": "EXPENSE",
      "category": "Food",
      "date": "2026-04-05T00:00:00.000Z"
    },
    ...

  ]
}
```
*Note: Response truncated for brevity.*

#### 🔍 Features Demonstrated

* User-specific data isolation
* Soft delete filtering (`isDeleted: false`)
* Structured response format

---

### 📄 3. Pagination

#### Request

```bash
GET /api/records?page=2&limit=1
```

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "f44e9360-04c2-496f-8447-6e0de4e8138d",
      "amount": 3000,
      "type": "EXPENSE",
      "category": "Travel",
      "date": "2026-05-02T00:00:00.000Z"
    }
  ]
}
```

#### 🔍 Features Demonstrated

* Server-side pagination
* Efficient data fetching
* Scalable API design

---

### 🔎 4. Search Functionality (Case-Insensitive)

#### Request

```bash
GET /api/records?search=food
```

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "2904ab5e-989c-440f-9345-6c7b0d0e1ddb",
      "amount": 2000,
      "type": "EXPENSE",
      "category": "Food"
    },
    {
      "id": "a5cd373a-d815-4796-bec8-fd6a9176067a",
      "amount": 2000,
      "type": "EXPENSE",
      "category": "food"
    }
  ]
}
```

#### 🔍 Features Demonstrated

* Case-insensitive search
* Flexible filtering
* Handles inconsistent user input

---

### 🧾 5. Filter by Type

#### Request

```bash
GET /api/records?type=INCOME
```

#### Response

```json
{
    "success": true,
    "data": [
        {
            "id": "4cd91f4c-ba3b-4666-8b13-569ce6c63e8f",
            "amount": 50000,
            "type": "INCOME",
            "category": "Freelance",
            "date": "2026-05-10T00:00:00.000Z",
            "notes": null,
            "isDeleted": false,
            "createdAt": "2026-04-03T16:21:38.121Z",
            "userId": "b9e3f776-bfe6-45f5-8ab2-61b1bae43524"
        },
        {
            "id": "2a64003a-8be7-49e5-969d-27901bad4695",
            "amount": 100000,
            "type": "INCOME",
            "category": "Salary",
            "date": "2026-04-03T00:00:00.000Z",
            "notes": "Monthly salary",
            "isDeleted": false,
            "createdAt": "2026-04-03T14:37:43.547Z",
            "userId": "b9e3f776-bfe6-45f5-8ab2-61b1bae43524"
        }
    ]
}
```

#### 🔍 Features Demonstrated

* Query-based filtering
* Dynamic query building
* Clean API design

---

### 🧾 6. Filter by Category

#### Request

```bash
GET /api/records?category=Food
```

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "2904ab5e-989c-440f-9345-6c7b0d0e1ddb",
      "amount": 2000,
      "type": "EXPENSE",
      "category": "Food"
    }
  ]
}
```

#### 🔍 Features Demonstrated

* Category-level filtering
* Supports analytics segmentation

---

### 🧾 7. Combined Filters

#### Request

```bash
GET /api/records?type=EXPENSE&search=food&page=1&limit=2
```

#### Response

```json
{
    "success": true,
    "data": [
        {
            "id": "2904ab5e-989c-440f-9345-6c7b0d0e1ddb",
            "amount": 2000,
            "type": "EXPENSE",
            "category": "Food",
            "date": "2026-04-05T00:00:00.000Z",
            "notes": null,
            "isDeleted": false,
            "createdAt": "2026-04-03T16:20:57.282Z",
            "userId": "b9e3f776-bfe6-45f5-8ab2-61b1bae43524"
        },
        {
            "id": "a5cd373a-d815-4796-bec8-fd6a9176067a",
            "amount": 2000,
            "type": "EXPENSE",
            "category": "food",
            "date": "2026-04-05T00:00:00.000Z",
            "notes": null,
            "isDeleted": false,
            "createdAt": "2026-04-03T16:21:11.456Z",
            "userId": "b9e3f776-bfe6-45f5-8ab2-61b1bae43524"
        }
    ]
}
```

#### 🔍 Features Demonstrated

* Multi-filter queries
* Pagination + search + filtering combined
* Real-world API usage scenario

---

### ❌ 8. Soft Delete

#### Request

```bash
DELETE /api/records/:id
```

#### Response

```json
{
  "success": true,
  "message": "Record deleted"
}
```

#### 🔍 Features Demonstrated

* Soft delete (`isDeleted = true`)
* Data integrity preservation
* Automatically excluded from analytics




---

## ⚙️ Setup Instructions

### 1. Clone repository

```bash
git clone <repo-url>
cd finance-dashboard-backend
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Create `.env` file

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

---

### 4. Run migrations

```bash
npx prisma migrate dev
```

---

### 5. Start server

```bash
npm run dev
```

---

## 🧠 Design Decisions

* PostgreSQL used for structured financial data
* Prisma for clean database abstraction
* JWT for stateless authentication
* Middleware-based RBAC for security
* Zod for validation and input safety
* Soft delete to preserve historical data
* Aggregation handled in service layer

---

## 📌 Assumptions

* Users can access only their own records
* Date filtering requires both startDate and endDate
* Single currency system
* No external integrations

---

## 🔮 Future Improvements

* Refresh tokens for authentication
* Rate limiting and security enhancements
* Redis caching for performance
* Prisma groupBy for optimized aggregation
* Swagger API documentation
* Unit and integration testing

---

## 🎯 Conclusion

This project demonstrates backend engineering concepts such as secure API design, authentication, authorization, validation, data modeling, and analytical processing aligned with real-world fintech applications.
