# API Documentation - Saylani Microfinance

Base URL: `http://localhost:5000/api`

## Table of Contents
- [Authentication](#authentication)
- [Loan Management](#loan-management)
- [Admin Operations](#admin-operations)
- [Error Handling](#error-handling)

---

## Authentication

### Register User
Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "cnic": "12345-1234567-1",
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully. Password sent to email.",
  "userId": "64abc123def456789"
}
```

**Errors:**
- `400`: User already exists
- `500`: Server error

---

### Login User
Authenticate and receive JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "TempPass123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64abc123def456789",
    "name": "John Doe",
    "email": "user@example.com",
    "isFirstLogin": true,
    "isAdmin": false
  }
}
```

**Errors:**
- `401`: Invalid credentials
- `500`: Server error

---

### Change Password
Change user password (requires authentication).

**Endpoint:** `POST /auth/change-password`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "TempPass123",
  "newPassword": "NewSecurePass456"
}
```

**Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

**Errors:**
- `401`: Unauthorized / Current password incorrect
- `500`: Server error

---

### Get User Profile
Retrieve authenticated user's profile.

**Endpoint:** `GET /auth/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "64abc123def456789",
  "cnic": "12345-1234567-1",
  "email": "user@example.com",
  "name": "John Doe",
  "isFirstLogin": false,
  "phoneNumber": "+92-300-1234567",
  "address": {
    "street": "123 Main St",
    "city": "Karachi",
    "country": "Pakistan",
    "zipCode": "75000"
  },
  "isAdmin": false,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Errors:**
- `401`: Unauthorized
- `500`: Server error

---

### Update User Profile
Update user's personal information.

**Endpoint:** `PUT /auth/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "phoneNumber": "+92-300-1234567",
  "address": {
    "street": "123 Main St",
    "city": "Karachi",
    "country": "Pakistan",
    "zipCode": "75000"
  }
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": { /* updated user object */ }
}
```

**Errors:**
- `401`: Unauthorized
- `404`: User not found
- `500`: Server error

---

## Loan Management

### Get Loan Categories
Retrieve all available loan categories and their details.

**Endpoint:** `GET /loan/categories`

**Response (200):**
```json
{
  "Wedding Loans": {
    "subcategories": ["Valima", "Furniture", "Valima Food", "Jahez"],
    "maxAmount": 500000,
    "periodYears": 3
  },
  "Home Construction Loans": {
    "subcategories": ["Structure", "Finishing", "Loan"],
    "maxAmount": 1000000,
    "periodYears": 5
  },
  "Business Startup Loans": {
    "subcategories": ["Buy Stall", "Advance Rent for Shop", "Shop Assets", "Shop Machinery"],
    "maxAmount": 1000000,
    "periodYears": 5
  },
  "Education Loans": {
    "subcategories": ["University Fees", "Child Fees Loan"],
    "maxAmount": null,
    "periodYears": 4
  }
}
```

---

### Calculate Loan
Calculate loan breakdown based on parameters.

**Endpoint:** `POST /loan/calculate`

**Request Body:**
```json
{
  "category": "Wedding Loans",
  "loanAmount": 300000,
  "initialDeposit": 50000,
  "periodMonths": 24
}
```

**Response (200):**
```json
{
  "totalLoan": 300000,
  "initialDeposit": 50000,
  "remainingAmount": 250000,
  "periodMonths": 24,
  "monthlyInstallment": 10417,
  "totalPayable": 300000
}
```

**Errors:**
- `400`: Invalid category or amount exceeds limit
- `500`: Server error

---

### Create Loan Request
Submit a new loan application (requires authentication).

**Endpoint:** `POST /loan/request`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "category": "Wedding Loans",
  "subcategory": "Valima",
  "loanAmount": 300000,
  "loanPeriod": 24,
  "initialDeposit": 50000,
  "additionalInfo": "Need loan for wedding ceremony"
}
```

**Response (201):**
```json
{
  "message": "Loan request created successfully",
  "loanRequest": {
    "_id": "64xyz789abc123def",
    "userId": "64abc123def456789",
    "category": "Wedding Loans",
    "subcategory": "Valima",
    "loanAmount": 300000,
    "loanPeriod": 24,
    "initialDeposit": 50000,
    "monthlyInstallment": 10417,
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Errors:**
- `401`: Unauthorized
- `400`: Invalid data
- `500`: Server error

---

### Add Guarantors
Add two guarantors to a loan request.

**Endpoint:** `POST /loan/request/:loanRequestId/guarantors`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "guarantors": [
    {
      "name": "Ali Ahmed",
      "email": "ali@example.com",
      "cnic": "42101-1234567-8",
      "location": "Karachi",
      "phoneNumber": "+92-300-1111111"
    },
    {
      "name": "Sara Khan",
      "email": "sara@example.com",
      "cnic": "42101-7654321-8",
      "location": "Karachi",
      "phoneNumber": "+92-300-2222222"
    }
  ]
}
```

**Response (200):**
```json
{
  "message": "Guarantors added successfully",
  "loanRequest": { /* updated loan request with guarantor IDs */ }
}
```

**Errors:**
- `400`: Must provide exactly 2 guarantors
- `401`: Unauthorized
- `403`: Not your loan request
- `404`: Loan request not found
- `500`: Server error

---

### Get User Loan Requests
Retrieve all loan requests for authenticated user.

**Endpoint:** `GET /loan/requests`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "64xyz789abc123def",
    "category": "Wedding Loans",
    "subcategory": "Valima",
    "loanAmount": 300000,
    "loanPeriod": 24,
    "monthlyInstallment": 10417,
    "status": "pending",
    "tokenNumber": null,
    "guarantors": [
      { /* guarantor 1 details */ },
      { /* guarantor 2 details */ }
    ],
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**Errors:**
- `401`: Unauthorized
- `500`: Server error

---

### Get Single Loan Request
Get details of a specific loan request.

**Endpoint:** `GET /loan/request/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "64xyz789abc123def",
  "userId": {
    "name": "John Doe",
    "email": "user@example.com",
    "cnic": "12345-1234567-1",
    "phoneNumber": "+92-300-1234567",
    "address": { /* address object */ }
  },
  "category": "Wedding Loans",
  "subcategory": "Valima",
  "loanAmount": 300000,
  "loanPeriod": 24,
  "initialDeposit": 50000,
  "monthlyInstallment": 10417,
  "status": "approved",
  "tokenNumber": "SWF123456789",
  "appointmentDate": "2024-02-01T00:00:00.000Z",
  "appointmentTime": "10:00 AM",
  "officeLocation": "Saylani Welfare Office, Karachi",
  "guarantors": [
    { /* full guarantor 1 details */ },
    { /* full guarantor 2 details */ }
  ],
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Errors:**
- `401`: Unauthorized
- `403`: Not your loan request (unless admin)
- `404`: Loan request not found
- `500`: Server error

---

### Generate Slip
Generate appointment slip with QR code.

**Endpoint:** `GET /loan/slip/:loanRequestId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "tokenNumber": "SWF123456789",
  "applicantName": "John Doe",
  "cnic": "12345-1234567-1",
  "loanAmount": 300000,
  "category": "Wedding Loans",
  "subcategory": "Valima",
  "appointmentDate": "2024-02-01T00:00:00.000Z",
  "appointmentTime": "10:00 AM",
  "officeLocation": "Saylani Welfare Office, Karachi",
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg..."
}
```

**Errors:**
- `400`: Token not assigned yet
- `401`: Unauthorized
- `403`: Not your loan request
- `404`: Loan request not found
- `500`: Server error

---

## Admin Operations

All admin endpoints require authentication and admin privileges.

### Get All Applications
Retrieve all loan applications with optional filters.

**Endpoint:** `GET /admin/applications`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `city` (optional): Filter by city
- `country` (optional): Filter by country
- `status` (optional): Filter by status

**Example:** `/admin/applications?city=Karachi&status=pending`

**Response (200):**
```json
[
  {
    "_id": "64xyz789abc123def",
    "userId": {
      "name": "John Doe",
      "email": "user@example.com",
      "cnic": "12345-1234567-1",
      "phoneNumber": "+92-300-1234567",
      "address": {
        "city": "Karachi",
        "country": "Pakistan"
      }
    },
    "category": "Wedding Loans",
    "subcategory": "Valima",
    "loanAmount": 300000,
    "status": "pending",
    "tokenNumber": null,
    "guarantors": [ /* guarantor details */ ],
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**Errors:**
- `401`: Unauthorized
- `403`: Access denied (not admin)
- `500`: Server error

---

### Get Statistics
Get application statistics for dashboard.

**Endpoint:** `GET /admin/stats`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "totalApplications": 150,
  "pendingApplications": 45,
  "approvedApplications": 80,
  "rejectedApplications": 15,
  "totalLoanAmount": 45000000
}
```

**Errors:**
- `401`: Unauthorized
- `403`: Access denied (not admin)
- `500`: Server error

---

### Update Application Status
Change the status of a loan application.

**Endpoint:** `PUT /admin/application/:id/status`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "approved"
}
```

**Valid statuses:**
- `pending`
- `under-review`
- `approved`
- `rejected`
- `completed`

**Response (200):**
```json
{
  "message": "Application status updated successfully",
  "loanRequest": { /* updated loan request */ }
}
```

**Errors:**
- `400`: Invalid status
- `401`: Unauthorized
- `403`: Access denied (not admin)
- `404`: Application not found
- `500`: Server error

---

### Assign Token and Appointment
Generate token number and schedule appointment.

**Endpoint:** `POST /admin/application/:id/assign`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "appointmentDate": "2024-02-01",
  "appointmentTime": "10:00 AM",
  "officeLocation": "Saylani Welfare Office, Karachi"
}
```

**Response (200):**
```json
{
  "message": "Token and appointment assigned successfully",
  "loanRequest": {
    "_id": "64xyz789abc123def",
    "tokenNumber": "SWF123456789",
    "appointmentDate": "2024-02-01T00:00:00.000Z",
    "appointmentTime": "10:00 AM",
    "officeLocation": "Saylani Welfare Office, Karachi",
    "status": "under-review",
    /* ... other fields */
  }
}
```

**Errors:**
- `401`: Unauthorized
- `403`: Access denied (not admin)
- `404`: Application not found
- `500`: Server error

---

### Get Application by Token
Look up application using token number.

**Endpoint:** `GET /admin/application/token/:tokenNumber`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  /* Full application details */
}
```

**Errors:**
- `401`: Unauthorized
- `403`: Access denied (not admin)
- `404`: Application not found
- `500`: Server error

---

## Error Handling

### Error Response Format

All errors follow this format:

```json
{
  "message": "Error description"
}
```

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

### Common Error Messages

**Authentication:**
- "No token, authorization denied"
- "Token is not valid"
- "User not found"
- "Invalid credentials"
- "Access denied. Admin only."

**Validation:**
- "Please fill all fields"
- "Exactly two guarantors are required"
- "Invalid loan category"
- "Loan amount exceeds maximum limit"
- "Invalid status"

**Business Logic:**
- "User with this email or CNIC already exists"
- "Token number not assigned yet"
- "Current password is incorrect"
- "Passwords do not match"

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- 100 requests per 15 minutes per IP
- Applies to all `/api/` endpoints

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

---

## Testing with Postman

Import this collection to test all endpoints:

1. Create environment with variables:
   - `baseUrl`: http://localhost:5000/api
   - `token`: (will be set after login)

2. Use Pre-request Scripts to set token:
   ```javascript
   pm.environment.set("token", pm.response.json().token);
   ```

3. Use Authorization header:
   ```
   Bearer {{token}}
   ```

---

**API Version:** 1.0.0  
**Last Updated:** January 2024
