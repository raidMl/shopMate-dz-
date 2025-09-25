const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');
const userRoutes = require('./src/routes/auth.Routes');
const productRoutes = require('./src/routes/product.Routes');
const categoryRoutes = require('./src/routes/category.Routes');
const orderRoutes = require('./src/routes/order.Routes');
const msgRoutes=require('./src/routes/sendMsg.Routes');
const { errorHandler, notFound } = require('./src/middleware/errorMiddleware');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Root route - Add this before API routes
app.get('/', (req, res) => {
  res.json({
    message: 'E-commerce API Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      api: '/api',
      users: '/api/users',
      products: '/api/products',
      categories: '/api/categories',
      orders: '/api/orders',
      messages: '/api/contact'
    }
  });
});

// API root route
app.get('/api', (req, res) => {
  res.json({
    message: 'E-commerce API Server',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      products: '/api/products',
      categories: '/api/categories',
      orders: '/api/orders',
      messages: '/api/messages'
    }
  });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', msgRoutes); // Add contact route

// Error middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);
});