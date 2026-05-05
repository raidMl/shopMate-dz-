const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');
const userRoutes = require('./src/routes/auth.Routes');
const productRoutes = require('./src/routes/product.Routes');
const categoryRoutes = require('./src/routes/category.Routes');
const orderRoutes = require('./src/routes/order.Routes');
const deliveryRoutes = require('./src/routes/delivery.Routes');
const siteConfigRoutes = require('./src/routes/siteConfig.Routes');
const msgRoutes=require('./src/routes/sendMsg.Routes');
const { errorHandler, notFound } = require('./src/middleware/errorMiddleware');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies
// app.use(cors({
//   origin: [
//     'http://localhost:3000',
//     'http://127.0.0.1:5500',
//     'http://localhost:5500',
//     'http://127.0.0.1:5500/client/html/SetupInfoGen.html',
//     'https://raidml.github.io',
//     'https://shopmate.dz',
//     'https://raidml.github.io/ecommerce-googlesheet/index.html'
//   ],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
// }));
app.use(cors({
  origin: '*', // Allow all origins (for development only, restrict in production)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

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
app.use('/api/delivery', deliveryRoutes);
app.use('/api/site-config', siteConfigRoutes);
app.use('/api/contact', msgRoutes); // Add contact route

// Error middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

// Only start server if not in Vercel environment
if (process.env.NODE_ENV !== 'production') {
    const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
        console.log('SIGTERM received, shutting down gracefully');
        server.close(() => {
            console.log('Server closed');
            process.exit(0);
        });
    });

    // Handle port already in use
    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.error(`❌ Port ${PORT} is already in use`);
            console.error(`Try: taskkill /F /IM node.exe  (PowerShell)`);
            console.error(`Or change PORT in .env file`);
            process.exit(1);
        } else {
            throw error;
        }
    });
}

// Export for Vercel
module.exports = app;