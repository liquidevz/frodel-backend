# Frozen Food Directory - API Documentation

## Overview

This is a comprehensive REST API for the Frozen Food Directory application built with Express.js, MongoDB, and JWT authentication. The API provides complete functionality for managing products, enquiries, and users.

## Base URL

```
http://localhost:5002/api
```

## Swagger Documentation

Interactive API documentation is available at:
```
http://localhost:5002/api-docs
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Admin Credentials

Default admin credentials for testing:
- **Email**: `varunbhole@gmail.com`
- **Password**: `password`

To create the admin user, run:
```bash
npm run seed:admin
```

## API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

**Response (201)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-02T08:00:00Z",
    "updatedAt": "2024-01-02T08:00:00Z"
  }
}
```

---

### Product Endpoints

#### Get All Products
```http
GET /api/products
```

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Frozen Chicken Breast",
      "description": "Premium quality frozen chicken",
      "category": "Poultry",
      "weightPerPiece": 200,
      "piecesPerKg": 5,
      "price": 5.99,
      "stock": 100,
      "imageUrl": "https://example.com/image.jpg",
      "isActive": true,
      "createdAt": "2024-01-02T08:00:00Z",
      "updatedAt": "2024-01-02T08:00:00Z"
    }
  ]
}
```

#### Get Single Product
```http
GET /api/products/{id}
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Frozen Chicken Breast",
    "description": "Premium quality frozen chicken",
    "category": "Poultry",
    "weightPerPiece": 200,
    "piecesPerKg": 5,
    "price": 5.99,
    "stock": 100,
    "imageUrl": "https://example.com/image.jpg",
    "isActive": true,
    "createdAt": "2024-01-02T08:00:00Z",
    "updatedAt": "2024-01-02T08:00:00Z"
  }
}
```

#### Create Product (Admin Only)
```http
POST /api/products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Frozen Shrimp",
  "description": "Large frozen shrimp",
  "category": "Seafood",
  "weightPerPiece": 15,
  "piecesPerKg": 67,
  "price": 12.99,
  "stock": 50,
  "imageUrl": "https://example.com/shrimp.jpg"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Frozen Shrimp",
    "description": "Large frozen shrimp",
    "category": "Seafood",
    "weightPerPiece": 15,
    "piecesPerKg": 67,
    "price": 12.99,
    "stock": 50,
    "imageUrl": "https://example.com/shrimp.jpg",
    "isActive": true,
    "createdAt": "2024-01-02T08:00:00Z",
    "updatedAt": "2024-01-02T08:00:00Z"
  }
}
```

#### Update Product (Admin Only)
```http
PUT /api/products/{id}
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "price": 11.99,
  "stock": 75
}
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Frozen Shrimp",
    "price": 11.99,
    "stock": 75,
    "updatedAt": "2024-01-02T09:00:00Z"
  }
}
```

#### Delete Product (Admin Only)
```http
DELETE /api/products/{id}
Authorization: Bearer <admin_token>
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "isActive": false
  }
}
```

---

### Enquiry Endpoints

#### Get All Enquiries (Admin Only)
```http
GET /api/enquiries
Authorization: Bearer <admin_token>
```

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "customerName": "ABC Company",
      "customerEmail": "contact@abc.com",
      "customerPhone": "+1234567890",
      "companyName": "ABC Foods Ltd",
      "items": [
        {
          "productId": "507f1f77bcf86cd799439011",
          "quantity": 100
        }
      ],
      "message": "Need bulk order",
      "status": "new",
      "adminNotes": "",
      "totalValue": 599,
      "createdAt": "2024-01-02T08:00:00Z",
      "updatedAt": "2024-01-02T08:00:00Z"
    }
  ]
}
```

#### Get Single Enquiry (Admin Only)
```http
GET /api/enquiries/{id}
Authorization: Bearer <admin_token>
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "customerName": "ABC Company",
    "customerEmail": "contact@abc.com",
    "customerPhone": "+1234567890",
    "companyName": "ABC Foods Ltd",
    "items": [
      {
        "productId": {
          "_id": "507f1f77bcf86cd799439011",
          "name": "Frozen Chicken Breast",
          "price": 5.99
        },
        "quantity": 100
      }
    ],
    "message": "Need bulk order",
    "status": "new",
    "adminNotes": "",
    "totalValue": 599,
    "createdAt": "2024-01-02T08:00:00Z",
    "updatedAt": "2024-01-02T08:00:00Z"
  }
}
```

#### Create Enquiry (Public)
```http
POST /api/enquiries
Content-Type: application/json

{
  "customerName": "XYZ Restaurant",
  "customerEmail": "order@xyz.com",
  "customerPhone": "+9876543210",
  "companyName": "XYZ Restaurant Chain",
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "quantity": 50
    },
    {
      "productId": "507f1f77bcf86cd799439012",
      "quantity": 25
    }
  ],
  "message": "Urgent bulk order needed for next week"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "customerName": "XYZ Restaurant",
    "customerEmail": "order@xyz.com",
    "customerPhone": "+9876543210",
    "companyName": "XYZ Restaurant Chain",
    "items": [
      {
        "productId": "507f1f77bcf86cd799439011",
        "quantity": 50
      },
      {
        "productId": "507f1f77bcf86cd799439012",
        "quantity": 25
      }
    ],
    "message": "Urgent bulk order needed for next week",
    "status": "new",
    "adminNotes": "",
    "totalValue": 599.75,
    "createdAt": "2024-01-02T08:00:00Z",
    "updatedAt": "2024-01-02T08:00:00Z"
  }
}
```

#### Update Enquiry Status (Admin Only)
```http
PUT /api/enquiries/{id}
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "contacted",
  "adminNotes": "Called customer, confirmed order for next week"
}
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "status": "contacted",
    "adminNotes": "Called customer, confirmed order for next week",
    "updatedAt": "2024-01-02T09:00:00Z"
  }
}
```

---

### User Management Endpoints (Admin Only)

#### Get All Users
```http
GET /api/users
Authorization: Bearer <admin_token>
```

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isActive": true,
      "createdAt": "2024-01-02T08:00:00Z",
      "updatedAt": "2024-01-02T08:00:00Z"
    }
  ]
}
```

#### Get Single User
```http
GET /api/users/{id}
Authorization: Bearer <admin_token>
```

#### Update User
```http
PUT /api/users/{id}
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "John Smith",
  "role": "admin",
  "isActive": true
}
```

#### Deactivate User
```http
DELETE /api/users/{id}
Authorization: Bearer <admin_token>
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "User role not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Access denied
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Enquiry Status Values

- `new` - New enquiry, not yet contacted
- `contacted` - Customer has been contacted
- `quoted` - Quote has been sent to customer
- `completed` - Order completed
- `rejected` - Enquiry rejected

---

## Product Categories

- Poultry
- Seafood
- Vegetables
- Fruits
- Meat
- Dairy
- Other

---

## Testing with cURL

### Login as Admin
```bash
curl -X POST http://localhost:5002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "varunbhole@gmail.com",
    "password": "password"
  }'
```

### Get All Products
```bash
curl http://localhost:5002/api/products
```

### Create Product (requires admin token)
```bash
curl -X POST http://localhost:5002/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Frozen Fish",
    "category": "Seafood",
    "weightPerPiece": 300,
    "piecesPerKg": 3,
    "price": 8.99,
    "stock": 50
  }'
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider implementing rate limiting middleware.

---

## CORS

CORS is enabled for the frontend URL specified in the `.env` file. Default: `http://localhost:3000`

---

## Support

For issues or questions about the API, refer to the main README or check the Swagger documentation at `/api-docs`.
