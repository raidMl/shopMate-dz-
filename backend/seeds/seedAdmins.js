/**
 * Database Seed Script
 * Seeds the database with initial admin users
 * 
 * Usage: node seeds/seedAdmins.js
 * Run this ONCE to set up initial admins
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });

const { User } = require("../src/models");

// Define initial admins
const initialAdmins = [
  {
    name: "Super Admin",
    email: "raidreus.22@mail.com",
    password: "raid2016",
    role: "super_admin",
    status: "active",
    site: null, // Super admin has no site restriction
    permissions: {
      manageAdmins: true,
      manageTheme: true,
      viewStats: true,
      manageSite: true,
    }
  },
  {
    name: "Admin - Site 1",
    email: "admin1@example.com",
    password: "admin123",
    role: "admin",
    status: "active",
    site: "site1.com",
    permissions: {
      manageAdmins: false,
      manageTheme: true,
      viewStats: true,
      manageSite: true,
    }
  },
  {
    name: "Admin - Site 2",
    email: "admin2@example.com",
    password: "admin456",
    role: "admin",
    status: "active",
    site: "site2.com",
    permissions: {
      manageAdmins: false,
      manageTheme: true,
      viewStats: true,
      manageSite: true,
    }
  },
  {
    name: "Admin - Site 3",
    email: "admin3@example.com",
    password: "admin789",
    role: "admin",
    status: "active",
    site: "site3.com",
    permissions: {
      manageAdmins: false,
      manageTheme: true,
      viewStats: true,
      manageSite: true,
    }
  }
];

async function seedAdmins() {
  try {
    console.log("\n🌱 Starting admin seed...\n");

    // Check if super admin already exists
    const superAdminExists = await User.findOne({ role: "super_admin" });
    if (superAdminExists) {
      console.log("⚠️  Super admin already exists. Skipping seed.");
      console.log("Super Admin:", {
        name: superAdminExists.name,
        email: superAdminExists.email,
        role: superAdminExists.role,
        status: superAdminExists.status
      });
      await mongoose.disconnect();
      process.exit(0);
    }

    // Hash passwords and create admins
    for (const adminData of initialAdmins) {
      // Check if admin already exists
      const existingAdmin = await User.findOne({ email: adminData.email });
      if (existingAdmin) {
        console.log(`⏭️  Admin ${adminData.email} already exists. Skipping.`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(adminData.password, 10);

      // Create admin
      const admin = new User({
        ...adminData,
        password: hashedPassword
      });

      await admin.save();
      console.log(`✅ Created ${adminData.role}: ${adminData.name} (${adminData.email})`);
    }

    console.log("\n🎉 Admin seed completed successfully!\n");
    console.log("📋 Created Admins:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("SUPER ADMIN:");
    console.log("  📧 Email: raidreus.22@mail.com");
    console.log("  🔐 Password: raid2016");
    console.log("  🎯 Role: super_admin (Full access)");
    console.log("  📍 Site: All sites");
    console.log("  ✨ Can: Manage admins, theme, stats, all sites\n");

    console.log("REGULAR ADMINS:");
    console.log("  📧 Email: admin1@example.com | 🔐 Password: admin123 | 📍 Site: site1.com");
    console.log("  📧 Email: admin2@example.com | 🔐 Password: admin456 | 📍 Site: site2.com");
    console.log("  📧 Email: admin3@example.com | 🔐 Password: admin789 | 📍 Site: site3.com");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    // Display summary
    const totalAdmins = await User.countDocuments({ role: { $in: ["admin", "super_admin"] } });
    console.log(`📊 Total Admins in Database: ${totalAdmins}`);

    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error("❌ Error during seed:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run seed
seedAdmins();
