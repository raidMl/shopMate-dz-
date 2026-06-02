const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const { generateAdminClientFolder } = require("../utils/siteGenerator");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if JWT_SECRET is defined
    if (!JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET is not configured" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    // GENERATE CLIENT WEBSITE FOLDER if they are an admin
    if (user.role === "admin" || user.role === "super_admin") {
      try {
        const adminSlug = email.split('@')[0];
        generateAdminClientFolder(adminSlug);
      } catch (genError) {
        console.error(`❌ Failed to generate client folder for ${user.email}:`, genError.message);
      }
    }

    // Generate token for the new user
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

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

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if JWT_SECRET is defined
    if (!JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET is not configured" });
    }

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

    res.json({ 
      message: "Login successful", 
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
