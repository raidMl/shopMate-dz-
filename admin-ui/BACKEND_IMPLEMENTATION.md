# Backend Implementation Examples

This file provides example implementations for the required backend endpoints.

## 1. Admin Controller Methods

```javascript
// backend/src/controllers/userController.js

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

// Get all admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password");
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get admin by ID
exports.getAdminById = async (req, res) => {
  try {
    const admin = await User.findById(req.params.id).select("-password");
    if (!admin || admin.role !== "admin") {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new admin
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin"
    });

    await admin.save();

    // Return without password
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      createdAt: admin.createdAt
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update admin
exports.updateAdmin = async (req, res) => {
  try {
    const { name, email } = req.body;
    const admin = await User.findById(req.params.id);

    if (!admin || admin.role !== "admin") {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check if new email is already used by another user
    if (email && email !== admin.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
      admin.email = email;
    }

    if (name) {
      admin.name = name;
    }

    await admin.save();

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      createdAt: admin.createdAt
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete admin
exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);

    if (!admin || admin.role !== "admin") {
      return res.status(404).json({ message: "Admin not found" });
    }

    await User.deleteOne({ _id: req.params.id });

    res.json({ message: "Admin deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Change password
exports.changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await User.findById(req.params.id);

    if (!admin || admin.role !== "admin") {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;

    await admin.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all users (for dashboard)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
```

## 2. Routes Configuration

```javascript
// backend/src/routes/userRoutes.js

const express = require("express");
const router = express.Router();
const {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  changeAdminPassword,
  getAllUsers,
  login,
  register
} = require("../controllers/userController");
const { authenticateToken } = require("../middleware/auth");

// Public routes
router.post("/login", login);
router.post("/register", register);

// Protected routes (require authentication)
router.use(authenticateToken); // Apply auth middleware to all routes below

// Admin management routes
router.post("/admins", createAdmin);
router.get("/admins", getAllAdmins);
router.get("/admins/:id", getAdminById);
router.put("/admins/:id", updateAdmin);
router.delete("/admins/:id", deleteAdmin);
router.put("/admins/:id/password", changeAdminPassword);

// User management routes
router.get("/", getAllUsers);

module.exports = router;
```

## 3. Authentication Middleware

```javascript
// backend/src/middleware/auth.js

const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Optional: Middleware to check admin role
exports.requireAdmin = (req, res, next) => {
  const { User } = require("../models");

  User.findById(req.user.id)
    .then((user) => {
      if (user && user.role === "admin") {
        next();
      } else {
        res.status(403).json({ message: "Admin privileges required" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};
```

## 4. Updated Main Routes File

```javascript
// backend/index.js or backend/src/index.js

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB connection error:", err));

// Routes
const authRoutes = require("./src/routes/auth.Routes");
const productRoutes = require("./src/routes/product.Routes");
const categoryRoutes = require("./src/routes/category.Routes");
const orderRoutes = require("./src/routes/order.Routes");
const userRoutes = require("./src/routes/userRoutes"); // NEW

app.use("/api/users", userRoutes); // NEW - Add user routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 5. Testing with cURL

```bash
# Login (get token)
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'

# Response should include token:
# {
#   "_id": "...",
#   "name": "Admin Name",
#   "email": "admin@example.com",
#   "role": "admin",
#   "token": "eyJhbGciOiJIUzI1NiIs..."
# }

# Create admin (use token from login)
curl -X POST http://localhost:5000/api/users/admins \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "New Admin",
    "email": "newadmin@example.com",
    "password": "securepass123",
    "role": "admin"
  }'

# Get all admins
curl -X GET http://localhost:5000/api/users/admins \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Get all users (for dashboard)
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Update admin
curl -X PUT http://localhost:5000/api/users/admins/ADMIN_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Updated Name",
    "email": "updated@example.com"
  }'

# Delete admin
curl -X DELETE http://localhost:5000/api/users/admins/ADMIN_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Change password
curl -X PUT http://localhost:5000/api/users/admins/ADMIN_ID/password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "currentPassword": "oldpassword",
    "newPassword": "newpassword"
  }'
```

## Key Points

1. **Authentication**: All admin endpoints require JWT token in Authorization header
2. **Password Hashing**: Use bcrypt to hash passwords before storing
3. **Email Uniqueness**: Verify email is unique before creating/updating
4. **Role Verification**: Ensure user role is "admin" for admin endpoints
5. **Error Handling**: Return appropriate HTTP status codes
6. **Security**: Never return passwords in responses

## Environment Variables Required

```
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-secret-key-here
PORT=5000
```

## Testing Sequence

1. Create an admin user manually in database or via register endpoint
2. Login with that admin account to get token
3. Use token to test other endpoints
4. Verify admin counts appear on dashboard
