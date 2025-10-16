# Express.js Products API

A production-ready RESTful API built with Express.js implementing comprehensive CRUD operations, authentication, validation, error handling, and advanced querying capabilities for product management.

## Table of Contents

- Overview(#overview)
- Features(#features)
- Technology Stack(#technology-stack)
- Prerequisites(#prerequisites)
- Installation(#installation)
- Configuration(#configuration)
- Running the Application(#running-the-application)
- API Documentation(#api-documentation)
  - Authentication(#authentication)
  - Endpoints(#endpoints)
  - Request Examples(#request-examples)
  - Response Format(#response-format)
  - Error Handling(#error-handling)
- Project Architecture(#project-architecture)
- Middleware Documentation(#middleware-documentation)
- Testing(#testing)
- Deployment(#deployment)
- Security Considerations(#security-considerations)
- Contributing(#contributing)
- License(#license)

---

## Overview

This Express.js Products API is a fully-featured RESTful service designed for managing product inventory. It demonstrates industry best practices in API design, error handling, middleware implementation, and security patterns. The API provides comprehensive CRUD operations along with advanced features such as pagination, filtering, search, and analytics.

### Key Capabilities

- Complete product lifecycle management (Create, Read, Update, Delete)
- Advanced query capabilities with filtering and pagination
- Full-text search functionality
- Real-time product statistics and analytics
- Request logging and monitoring
- API key-based authentication
- Comprehensive input validation
- Centralized error handling with custom error classes

---

## Features

### Core Functionality
-  **RESTful API Design** - Follows REST architectural principles and best practices
-  **CRUD Operations** - Complete create, read, update, and delete functionality
-  **Data Validation** - Comprehensive input validation with detailed error messages
-  **Authentication** - API key-based authentication for protected endpoints
-  **Error Handling** - Custom error classes with proper HTTP status codes
-  **Request Logging** - Automatic logging of all API requests with timestamps



## Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18.x+ | JavaScript runtime environment |
| Express.js | 4.18.x | Web application framework |
| UUID | 9.0.x | Unique identifier generation |
| dotenv | 16.3.x | Environment variable management |
| nodemon | 3.0.x | Development auto-reload (dev dependency) |

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.0.0 or higher)
- **npm** (comes with Node.js)
- **Git** (for version control)
- **Postman** or **curl** (for API testing)

Verify your installations:

```bash
node --version  # Should be v18.x.x or higher
npm --version   # Should be 8.x.x or higher
git --version   # Any recent version
```

---

## Installation

### 1. Clone the Repository

```bash
git clone <https://github.com/PLP-MERN-Stack-Development/express-js-server-side-framework-Suudi-sudo.git>
cd express-js-server-side-framework-Suudi-sudo
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`:
- express
- uuid
- dotenv
- nodemon (dev dependency)

### 3. Verify Installation

```bash
npm list --depth=0
```

You should see all dependencies listed without errors.

---

## Configuration

### Environment Variables

The application uses environment variables for configuration. These are stored in a `.env` file which is not tracked by Git for security reasons.

**Create your `.env` file:**

```bash
cp .env.example .env
```



```env
# Server Configuration
PORT=3000
NODE_ENV=development

# API Authentication
API_KEY=your-secret-api-key-change-this-in-production
```

### Configuration Options

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Port number for the server |
| `NODE_ENV` | development | Environment mode (development/production) |
| `API_KEY` | your-secret-api-key | Secret key for API authentication |



## Running the Application

### Development Mode

Start the server with auto-reload on file changes:

```bash
npm run dev
```

The server will automatically restart when you modify any files.

### Production Mode

Start the server in production mode:

```bash
npm start
```

### Verify Server is Running

You should see output similar to:

```
Server is running on http://localhost:3000
Environment: development
```

Test the root endpoint:

```bash
curl http://localhost:3000/
```

Expected response:

```json
{
  "message": "Hello World! Welcome to the Products API",
  "version": "1.0.0",
  "endpoints": {
    "products": "/api/products",
    "search": "/api/products/search?q=query",
    "stats": "/api/products/stats"
  }
}
```

---

## API Documentation

### Base URL

```
http://localhost:3000
```

### Authentication

Protected endpoints require an API key to be included in the request headers.

**Header Format:**

```
x-api-key: your-secret-api-key
```

**Protected Endpoints:**
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

**Public Endpoints:**
- `GET /api/products` - List products
- `GET /api/products/:id` - Get single product
- `GET /api/products/search` - Search products
- `GET /api/products/stats` - Get statistics

---

### Endpoints

#### 1. Root Endpoint

**Request:**
```http
GET /
```

**Description:** Returns API information and available endpoints.

**Response:** `200 OK`
```json
{
  "message": "Hello World! Welcome to the Products API",
  "version": "1.0.0",
  "endpoints": {
    "products": "/api/products",
    "search": "/api/products/search?q=query",
    "stats": "/api/products/stats"
  }
}
```

---

#### 2. List All Products

**Request:**
```http
GET /api/products
```

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `category` | string | No | - | Filter by product category |
| `inStock` | boolean | No | - | Filter by stock status (true/false) |
| `page` | integer | No | 1 | Page number for pagination |
| `limit` | integer | No | 10 | Number of items per page |

**Example Requests:**

```bash
# Get all products
curl http://localhost:3000/api/products

# Filter by category
curl http://localhost:3000/api/products?category=Electronics

# Filter by stock status
curl http://localhost:3000/api/products?inStock=true

# Combine filters with pagination
curl "http://localhost:3000/api/products?category=Electronics&inStock=true&page=1&limit=5"
```

**Response:** `200 OK`
```json
{
  "success": true,
  "count": 1,
  "total": 1,
  "page": 1,
  "totalPages": 1,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Laptop",
      "description": "High-performance laptop for professionals",
      "price": 1299.99,
      "category": "Electronics",
      "inStock": true
    }
  ]
}
```

---

#### 3. Get Single Product

**Request:**
```http
GET /api/products/:id
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | Yes | Unique product identifier |

**Example Request:**

```bash
curl http://localhost:3000/api/products/550e8400-e29b-41d4-a716-446655440000
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Laptop",
    "description": "High-performance laptop for professionals",
    "price": 1299.99,
    "category": "Electronics",
    "inStock": true
  }
}
```

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "error": {
    "message": "Product with ID 550e8400-e29b-41d4-a716-446655440000 not found",
    "statusCode": 404
  }
}
```

---

#### 4. Search Products

**Request:**
```http
GET /api/products/search
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | Yes | Search query string |

**Example Requests:**

```bash
# Search for laptops
curl http://localhost:3000/api/products/search?q=laptop

# Search with multiple words
curl "http://localhost:3000/api/products/search?q=wireless mouse"
```

**Response:** `200 OK`
```json
{
  "success": true,
  "count": 1,
  "query": "laptop",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Laptop",
      "description": "High-performance laptop for professionals",
      "price": 1299.99,
      "category": "Electronics",
      "inStock": true
    }
  ]
}
```

---

#### 5. Get Product Statistics

**Request:**
```http
GET /api/products/stats
```

**Description:** Returns aggregated statistics about all products in the system.

**Example Request:**

```bash
curl http://localhost:3000/api/products/stats
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "totalProducts": 3,
    "inStock": 2,
    "outOfStock": 1,
    "byCategory": {
      "Electronics": 1,
      "Furniture": 1,
      "Appliances": 1
    },
    "averagePrice": "559.99",
    "totalValue": "1679.97"
  }
}
```

---

#### 6. Create Product

**Request:**
```http
POST /api/products
```

**Authentication:** Required (API Key)

**Request Body:**

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `name` | string | Yes | Non-empty | Product name |
| `description` | string | Yes | - | Product description |
| `price` | number | Yes | ≥ 0 | Product price |
| `category` | string | Yes | - | Product category |
| `inStock` | boolean | Yes | - | Stock availability |

**Example Request:**

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-secret-api-key" \
  -d '{
    "name": "Wireless Mouse",
    "description": "Ergonomic wireless mouse with USB receiver",
    "price": 29.99,
    "category": "Electronics",
    "inStock": true
  }'
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Wireless Mouse",
    "description": "Ergonomic wireless mouse with USB receiver",
    "price": 29.99,
    "category": "Electronics",
    "inStock": true
  }
}
```

**Validation Error:** `400 Bad Request`
```json
{
  "success": false,
  "error": {
    "message": "Price is required and must be a non-negative number",
    "statusCode": 400
  }
}
```

**Authentication Error:** `401 Unauthorized`
```json
{
  "success": false,
  "error": {
    "message": "Invalid or missing API key",
    "statusCode": 401
  }
}
```

---

#### 7. Update Product

**Request:**
```http
PUT /api/products/:id
```

**Authentication:** Required (API Key)

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | Yes | Unique product identifier |

**Request Body:** Same as Create Product (all fields required)

**Example Request:**

```bash
curl -X PUT http://localhost:3000/api/products/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-secret-api-key" \
  -d '{
    "name": "Wireless Mouse Pro",
    "description": "Premium ergonomic wireless mouse with customizable buttons",
    "price": 49.99,
    "category": "Electronics",
    "inStock": true
  }'
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Wireless Mouse Pro",
    "description": "Premium ergonomic wireless mouse with customizable buttons",
    "price": 49.99,
    "category": "Electronics",
    "inStock": true
  }
}
```

---

#### 8. Delete Product

**Request:**
```http
DELETE /api/products/:id
```

**Authentication:** Required (API Key)

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | Yes | Unique product identifier |

**Example Request:**

```bash
curl -X DELETE http://localhost:3000/api/products/123e4567-e89b-12d3-a456-426614174000 \
  -H "x-api-key: your-secret-api-key"
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Wireless Mouse Pro",
    "description": "Premium ergonomic wireless mouse with customizable buttons",
    "price": 49.99,
    "category": "Electronics",
    "inStock": true
  }
}
```

---

### Response Format

All API responses follow a consistent structure for predictability and ease of client-side handling.

**Success Response Structure:**

```json
{
  "success": true,
  "message": "Optional success message",
  "data": { /* Response data */ },
  "count": "Number of items (for lists)",
  "total": "Total items available (for pagination)",
  "page": "Current page number",
  "totalPages": "Total pages available"
}
```

**Error Response Structure:**

```json
{
  "success": false,
  "error": {
    "message": "Human-readable error message",
    "statusCode": 400
  }
}
```

---

### Error Handling

The API implements comprehensive error handling with appropriate HTTP status codes and descriptive error messages.

#### HTTP Status Codes

| Status Code | Meaning | Usage |
|-------------|---------|-------|
| 200 | OK | Successful GET, PUT, DELETE requests |
| 201 | Created | Successful POST request |
| 400 | Bad Request | Validation errors, malformed requests |
| 401 | Unauthorized | Missing or invalid API key |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server-side errors |

#### Error Response Examples

**Validation Error (400):**
```json
{
  "success": false,
  "error": {
    "message": "Name is required and must be a non-empty string; Price is required and must be a non-negative number",
    "statusCode": 400
  }
}
```

**Authentication Error (401):**
```json
{
  "success": false,
  "error": {
    "message": "Invalid or missing API key",
    "statusCode": 401
  }
}
```

**Not Found Error (404):**
```json
{
  "success": false,
  "error": {
    "message": "Product with ID abc123 not found",
    "statusCode": 404
  }
}
```

---

## Project Architecture

### File Structure

```
express-products-api/
├── server.js              # Main application entry point
├── package.json           # Project dependencies and scripts
├── package-lock.json      # Locked dependency versions
├── .env                   # Environment variables (not in Git)
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
├── README.md             # This documentation
└── node_modules/         # Installed dependencies (not in Git)
```

### Code Organization

The `server.js` file is organized into logical sections:

1. **Dependencies & Configuration** - Imports and app initialization
2. **Data Storage** - In-memory product database
3. **Custom Error Classes** - AppError, NotFoundError, ValidationError, AuthenticationError
4. **Middleware** - Logger, authentication, validation, async handler
5. **Routes** - RESTful endpoint definitions
6. **Error Handling** - 404 handler and global error middleware
7. **Server Start** - Application listener

---

## Middleware Documentation

### 1. Logger Middleware

**Purpose:** Logs all incoming requests with method, URL, and timestamp.

**Implementation:**
```javascript
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};
```

**Output Example:**
```
[2024-10-16T10:30:45.123Z] GET /api/products
[2024-10-16T10:30:47.456Z] POST /api/products
```

### 2. Authentication Middleware

**Purpose:** Validates API key for protected routes.

**Implementation:**
- Checks for `x-api-key` header
- Compares against environment variable
- Throws AuthenticationError if invalid

**Usage:**
```javascript
app.post('/api/products', authenticate, validateProduct, asyncHandler(...));
```

### 3. Validation Middleware

**Purpose:** Validates product data structure and content.

**Validation Rules:**
- `name`: Required, non-empty string
- `description`: Required string
- `price`: Required, non-negative number
- `category`: Required string
- `inStock`: Required boolean

**Error Handling:**
- Collects all validation errors
- Returns comprehensive error message
- Throws ValidationError with 400 status

### 4. Async Handler

**Purpose:** Eliminates repetitive try-catch blocks for async routes.

**Implementation:**
```javascript
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
```

**Benefits:**
- Cleaner route handlers
- Automatic error forwarding
- Consistent error handling

---

## Testing

### Manual Testing with curl

Test all endpoints using the examples provided in the [API Documentation](#api-documentation) section.

### Testing Checklist

-  Root endpoint returns API information
-  GET all products returns product list
-  GET single product returns correct product
-  GET with invalid ID returns 404
-  Search returns relevant results
-  Statistics return correct calculations
-  POST without API key returns 401
-  POST with invalid data returns 400
-  POST with valid data creates product
-  PUT updates existing product
-  DELETE removes product
-  Pagination works correctly
-  Filtering by category works
-  Filtering by stock status works

### Postman Collection

For comprehensive testing, create a Postman collection with:

1. Environment variables (base URL, API key)
2. All endpoint requests
3. Test scripts for response validation
4. Pre-request scripts for dynamic data

---

## Deployment

### Production Checklist

Before deploying to production:

-  Change default API key to a strong, random value
-  Set `NODE_ENV=production`
-  Use a process manager (PM2, systemd)
-  Implement proper logging (Winston, Morgan)
-  Add rate limiting (express-rate-limit)
-  Enable security headers (Helmet.js)
-  Set up monitoring and alerting
-  Use a real database (PostgreSQL, MongoDB)
-  Implement database connection pooling
-  Add CORS configuration for specific origins
-  Use HTTPS/TLS encryption
-  Implement request size limits
-  Add API documentation (Swagger/OpenAPI)
-  Set up CI/CD pipeline
-  Configure error tracking (Sentry)

### Environment-Specific Configuration

**Development:**
```env
NODE_ENV=development
PORT=3000
API_KEY=dev-api-key
```

**Production:**
```env
NODE_ENV=production
PORT=8080
API_KEY=<strong-random-key>
```

### Database Migration

Current implementation uses in-memory storage. For production:

1. Choose a database (PostgreSQL recommended)
2. Install ORM/ODM (Sequelize, TypeORM, Prisma)
3. Create database schema
4. Implement connection pooling
5. Add migration scripts
6. Update CRUD operations

---

## Security Considerations

### Current Implementation

 API key authentication
 Input validation
 Error message sanitization
 Environment variable configuration

### Recommended Enhancements

**For Production Deployment:**

1. **Rate Limiting**
   ```javascript
   const rateLimit = require('express-rate-limit');
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   app.use('/api/', limiter);
   ```

2. **Security Headers**
   ```javascript
   const helmet = require('helmet');
   app.use(helmet());
   ```

3. **CORS Configuration**
   ```javascript
   const cors = require('cors');
   app.use(cors({
     origin: process.env.ALLOWED_ORIGINS.split(','),
     credentials: true
   }));
   ```

4. **Request Size Limits**
   ```javascript
   app.use(express.json({ limit: '10kb' }));
   ```

5. **Input Sanitization**
   - Use libraries like `express-validator`
   - Sanitize user inputs to prevent injection attacks

6. **HTTPS**
   - Always use HTTPS in production
   - Redirect HTTP to HTTPS

7. **Authentication Upgrade**
   - Implement JWT tokens
   - Add refresh token mechanism
   - Consider OAuth2 for third-party access

---

## Contributing

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Use meaningful variable and function names
- Add comments for complex logic
- Follow existing code formatting
- Write descriptive commit messages
- Update documentation for API changes

---







## Acknowledgments

This project was built as part of a comprehensive backend development learning journey, implementing industry-standard practices for RESTful API development with Express.js.

### Technologies & Resources

- [Express.js Documentation](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [REST API Design Best Practices](https://restfulapi.net/)
- [HTTP Status Codes Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

---

**Version:** 1.0.0  
**Last Updated:** October 2024  
**Node.js Version:** 18.x+  
**Express.js Version:** 4.18.x