const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Updated to use destructured import

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Extract Bearer token

    if (!token) {
        return res.status(401).json({ message: "Access token required" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error("Token verification error:", err.message);
            return res.status(403).json({ message: "Invalid or expired token" });
        }
        req.user = user;
        next();
    });
};

// Keep old names for backward compatibility
const authMiddleware = authenticateToken;

const adminMiddleware = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }
        
        if (user.status === "suspended") {
            return res.status(403).json({ message: "Your account has been suspended" });
        }
        
        next();
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};

/**
 * Middleware to check if user is super admin
 */
const requireSuperAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "super_admin") {
            return res.status(403).json({ message: "Super admin privileges required" });
        }

        if (user.status === "suspended") {
            return res.status(403).json({ message: "Your account has been suspended" });
        }

        req.currentUser = user;
        next();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Middleware to check if user has specific permission
 */
const requirePermission = (permission) => async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === "super_admin") {
            // Super admin has all permissions
            req.currentUser = user;
            return next();
        }

        if (!user.permissions || !user.permissions[permission]) {
            return res.status(403).json({ 
                message: `Permission denied. You do not have ${permission} permission` 
            });
        }

        req.currentUser = user;
        next();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    authMiddleware,
    adminMiddleware,
    authenticateToken,
    requireSuperAdmin,
    requirePermission,
};