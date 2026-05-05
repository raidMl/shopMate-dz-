/**
 * Admin Controller with Super Admin Support
 * Handles admin management with role-based access control
 */

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

// ========================
// LOGIN
// ========================

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET is not configured" });
    }

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if admin is suspended
    if (user.role !== "user" && user.status === "suspended") {
      return res.status(403).json({ message: "Your account has been suspended" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Only admins and super_admins can login to admin panel
    if (user.role !== "admin" && user.role !== "super_admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    // Update last login
    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

    res.json({
      message: "Login successful",
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      site: user.site,
      status: user.status,
      permissions: user.permissions,
      token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================
// GET ALL ADMINS
// ========================

exports.getAllAdmins = async (req, res) => {
  try {
    // Only super admins can view all admins
    const requester = await User.findById(req.user.id);
    if (requester.role !== "super_admin") {
      return res.status(403).json({ message: "Only super admins can view all admins" });
    }

    const admins = await User.find({ role: { $in: ["admin", "super_admin"] } })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================
// GET ADMIN BY ID
// ========================

exports.getAdminById = async (req, res) => {
  try {
    const requester = await User.findById(req.user.id);

    const admin = await User.findById(req.params.id)
      .select("-password");

    if (!admin || (admin.role !== "admin" && admin.role !== "super_admin")) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Only super admin or self can view details
    if (requester.role !== "super_admin" && requester._id.toString() !== admin._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================
// CREATE ADMIN
// ========================

exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password, site, role } = req.body;

    // Only super admin can create admins
    const requester = await User.findById(req.user.id);
    if (requester.role !== "super_admin") {
      return res.status(403).json({ message: "Only super admin can create admins" });
    }

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
      role: role === "super_admin" ? "super_admin" : "admin",
      site: site || null,
      status: "active",
      permissions: {
        manageAdmins: role === "super_admin" ? true : false,
        manageTheme: true,
        viewStats: true,
        manageSite: true,
      }
    });

    await admin.save();

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        site: admin.site,
        status: admin.status,
        permissions: admin.permissions,
        createdAt: admin.createdAt
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================
// UPDATE ADMIN
// ========================

exports.updateAdmin = async (req, res) => {
  try {
    const { name, email, site } = req.body;

    // Only super admin can update admins
    const requester = await User.findById(req.user.id);
    if (requester.role !== "super_admin") {
      return res.status(403).json({ message: "Only super admin can update admins" });
    }

    const admin = await User.findById(req.params.id);
    if (!admin || (admin.role !== "admin" && admin.role !== "super_admin")) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Update fields
    if (name) admin.name = name;
    if (email && email !== admin.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
      admin.email = email;
    }
    if (site !== undefined) admin.site = site;

    await admin.save();

    res.json({
      message: "Admin updated successfully",
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        site: admin.site,
        status: admin.status,
        permissions: admin.permissions,
        createdAt: admin.createdAt
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================
// DELETE ADMIN
// ========================

exports.deleteAdmin = async (req, res) => {
  try {
    // Only super admin can delete admins
    const requester = await User.findById(req.user.id);
    if (requester.role !== "super_admin") {
      return res.status(403).json({ message: "Only super admin can delete admins" });
    }

    const admin = await User.findById(req.params.id);
    if (!admin || (admin.role !== "admin" && admin.role !== "super_admin")) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Prevent deleting self
    if (admin._id.toString() === requester._id.toString()) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }

    await User.deleteOne({ _id: req.params.id });

    res.json({ 
      message: "Admin deleted successfully",
      deletedAdmin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================
// SUSPEND/ACTIVATE ADMIN
// ========================

exports.changeAdminStatus = async (req, res) => {
  try {
    const { status } = req.body; // "active", "inactive", "suspended"

    if (!["active", "inactive", "suspended"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Only super admin can change status
    const requester = await User.findById(req.user.id);
    if (requester.role !== "super_admin") {
      return res.status(403).json({ message: "Only super admin can change admin status" });
    }

    const admin = await User.findById(req.params.id);
    if (!admin || (admin.role !== "admin" && admin.role !== "super_admin")) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Prevent changing self status to suspended
    if (admin._id.toString() === requester._id.toString() && status === "suspended") {
      return res.status(400).json({ message: "Cannot suspend your own account" });
    }

    admin.status = status;
    await admin.save();

    res.json({
      message: `Admin status changed to ${status}`,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status,
        site: admin.site
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================
// CHANGE PASSWORD
// ========================

exports.changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const requester = await User.findById(req.user.id);

    const admin = await User.findById(req.params.id);
    if (!admin || (admin.role !== "admin" && admin.role !== "super_admin")) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Can only change own password or super admin can change anyone's
    if (requester._id.toString() !== admin._id.toString() && requester.role !== "super_admin") {
      return res.status(403).json({ message: "Not authorized to change this password" });
    }

    // If not super admin, verify current password
    if (requester.role !== "super_admin") {
      const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
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

// ========================
// GET STATISTICS (Super Admin Only)
// ========================

exports.getStatistics = async (req, res) => {
  try {
    // Only super admin can view full statistics
    const requester = await User.findById(req.user.id);
    if (requester.role !== "super_admin") {
      return res.status(403).json({ message: "Only super admin can view statistics" });
    }

    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalSuperAdmins = await User.countDocuments({ role: "super_admin" });
    const activeAdmins = await User.countDocuments({ role: { $in: ["admin", "super_admin"] }, status: "active" });
    const suspendedAdmins = await User.countDocuments({ role: { $in: ["admin", "super_admin"] }, status: "suspended" });

    const stats = {
      totalAdmins,
      totalSuperAdmins,
      activeAdmins,
      suspendedAdmins,
      totalAdminAccounts: totalAdmins + totalSuperAdmins,
      lastUpdated: new Date()
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET is not configured" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user"
    });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
