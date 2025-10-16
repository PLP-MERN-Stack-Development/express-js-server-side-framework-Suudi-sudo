const express = require('express');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory database (for demonstration purposes)
let products = [
  {
    id: uuidv4(),
    name: 'Laptop',
    description: 'High-performance laptop for professionals',
    price: 1299.99,
    category: 'Electronics',
    inStock: true
  },
  {
    id: uuidv4(),
    name: 'Desk Chair',
    description: 'Ergonomic office chair',
    price: 299.99,
    category: 'Furniture',
    inStock: true
  },
  {
    id: uuidv4(),
    name: 'Coffee Maker',
    description: 'Automatic drip coffee maker',
    price: 79.99,
    category: 'Appliances',
    inStock: false
  }
];

//  CUSTOM ERROR CLASSES 
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, 400);
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
  }
}

//  MIDDLEWARE 

// Logger middleware
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};

// JSON parser middleware
app.use(express.json());

// Apply logger to all routes
app.use(logger);

// Authentication middleware
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validApiKey = process.env.API_KEY || 'your-secret-api-key';
  
  if (!apiKey || apiKey !== validApiKey) {
    throw new AuthenticationError('Invalid or missing API key');
  }
  
  next();
};

// Validation middleware for product data
const validateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string');
  }

  if (!description || typeof description !== 'string') {
    errors.push('Description is required and must be a string');
  }

  if (price === undefined || typeof price !== 'number' || price < 0) {
    errors.push('Price is required and must be a non-negative number');
  }

  if (!category || typeof category !== 'string') {
    errors.push('Category is required and must be a string');
  }

  if (inStock === undefined || typeof inStock !== 'boolean') {
    errors.push('inStock is required and must be a boolean');
  }

  if (errors.length > 0) {
    throw new ValidationError(errors.join('; '));
  }

  next();
};

// Async error wrapper to avoid repetitive try-catch
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

//  ROUTES 

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Hello World! Welcome to the Products API',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      search: '/api/products/search?q=query',
      stats: '/api/products/stats'
    }
  });
});

// GET /api/products - List all products with filtering and pagination
app.get('/api/products', asyncHandler(async (req, res) => {
  let filteredProducts = [...products];
  
  // Filter by category
  if (req.query.category) {
    filteredProducts = filteredProducts.filter(
      p => p.category.toLowerCase() === req.query.category.toLowerCase()
    );
  }
  
  // Filter by inStock
  if (req.query.inStock !== undefined) {
    const inStockFilter = req.query.inStock === 'true';
    filteredProducts = filteredProducts.filter(p => p.inStock === inStockFilter);
  }
  
  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    count: paginatedProducts.length,
    total: filteredProducts.length,
    page,
    totalPages: Math.ceil(filteredProducts.length / limit),
    data: paginatedProducts
  });
}));

// GET /api/products/search - Search products by name
app.get('/api/products/search', asyncHandler(async (req, res) => {
  const query = req.query.q;
  
  if (!query) {
    throw new ValidationError('Search query parameter "q" is required');
  }
  
  const searchResults = products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.description.toLowerCase().includes(query.toLowerCase())
  );
  
  res.json({
    success: true,
    count: searchResults.length,
    query,
    data: searchResults
  });
}));

// GET /api/products/stats - Get product statistics
app.get('/api/products/stats', asyncHandler(async (req, res) => {
  const stats = {
    totalProducts: products.length,
    inStock: products.filter(p => p.inStock).length,
    outOfStock: products.filter(p => !p.inStock).length,
    byCategory: {},
    averagePrice: 0,
    totalValue: 0
  };
  
  // Calculate category counts
  products.forEach(p => {
    stats.byCategory[p.category] = (stats.byCategory[p.category] || 0) + 1;
  });
  
  // Calculate average price and total value
  const totalPrice = products.reduce((sum, p) => sum + p.price, 0);
  stats.averagePrice = products.length > 0 ? (totalPrice / products.length).toFixed(2) : 0;
  stats.totalValue = totalPrice.toFixed(2);
  
  res.json({
    success: true,
    data: stats
  });
}));

// GET /api/products/:id - Get a specific product by ID
app.get('/api/products/:id', asyncHandler(async (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  
  if (!product) {
    throw new NotFoundError(`Product with ID ${req.params.id} not found`);
  }
  
  res.json({
    success: true,
    data: product
  });
}));

// POST /api/products - Create a new product (requires authentication and validation)
app.post('/api/products', authenticate, validateProduct, asyncHandler(async (req, res) => {
  const newProduct = {
    id: uuidv4(),
    name: req.body.name.trim(),
    description: req.body.description.trim(),
    price: parseFloat(req.body.price),
    category: req.body.category.trim(),
    inStock: req.body.inStock
  };
  
  products.push(newProduct);
  
  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: newProduct
  });
}));

// PUT /api/products/:id - Update an existing product
app.put('/api/products/:id', authenticate, validateProduct, asyncHandler(async (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  
  if (index === -1) {
    throw new NotFoundError(`Product with ID ${req.params.id} not found`);
  }
  
  const updatedProduct = {
    id: req.params.id,
    name: req.body.name.trim(),
    description: req.body.description.trim(),
    price: parseFloat(req.body.price),
    category: req.body.category.trim(),
    inStock: req.body.inStock
  };
  
  products[index] = updatedProduct;
  
  res.json({
    success: true,
    message: 'Product updated successfully',
    data: updatedProduct
  });
}));

// DELETE /api/products/:id - Delete a product
app.delete('/api/products/:id', authenticate, asyncHandler(async (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  
  if (index === -1) {
    throw new NotFoundError(`Product with ID ${req.params.id} not found`);
  }
  
  const deletedProduct = products.splice(index, 1)[0];
  
  res.json({
    success: true,
    message: 'Product deleted successfully',
    data: deletedProduct
  });
}));

//  ERROR HANDLING 

// 404 handler for unknown routes
app.use((req, res, next) => {
  throw new NotFoundError(`Route ${req.originalUrl} not found`);
});

// Global error handler
app.use((err, req, res, next) => {
  // Set default values
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';
  
  // Log error for debugging (in production, use proper logging service)
  console.error('Error:', {
    message: err.message,
    statusCode: err.statusCode,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
  
  // Send error response
  res.status(err.statusCode).json({
    success: false,
    error: {
      message: err.message,
      statusCode: err.statusCode,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

//  SERVER START 
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;