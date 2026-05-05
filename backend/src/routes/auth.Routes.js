/**
 * Admin & Auth Routes with Role-Based Access Control
 * Handles authentication and admin user management
 */

const express = require("express");
const router = express.Router();
const {
  login,
  register,
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  changeAdminStatus,
  changeAdminPassword,
  getStatistics
} = require("../controllers/adminController");
const { authenticateToken, requireSuperAdmin, requirePermission } = require("../middleware/auth");

// ========================
// PUBLIC ROUTES
// ========================

// Login (public - for admin/user panel login)
router.post("/login", login);

// Register (public - for regular users)
router.post("/register", register);

// ========================
// PROTECTED ROUTES (All routes below require authentication)
// ========================

router.use(authenticateToken);

// ========================
// ADMIN MANAGEMENT (Super Admin Only)
// ========================

// Get all admins
router.get("/admins", getAllAdmins);

// Get specific admin
router.get("/admins/:id", getAdminById);

// Create new admin
router.post("/admins", createAdmin);

// Update admin details
router.put("/admins/:id", updateAdmin);

// Delete admin
router.delete("/admins/:id", deleteAdmin);

// Suspend/Activate/Deactivate admin
router.patch("/admins/:id/status", changeAdminStatus);

// Change admin password
router.put("/admins/:id/password", changeAdminPassword);

// Get my profile
router.get("/profile", async (req, res) => {
  try {
    const { User } = require("../models");
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update my profile
router.put("/profile", async (req, res) => {
  try {
    const { name } = req.body;
    const { User } = require("../models");
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    await user.save();

    res.json({
      message: "Profile updated",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get statistics (Super Admin only)
router.get("/stats/admin", getStatistics);

// ========================
// USER ROUTES (for dashboard)
// ========================

// Get all users (for dashboard counting)
router.get("/", async (req, res) => {
  try {
    const { User } = require("../models");
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
