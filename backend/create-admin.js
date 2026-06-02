const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['user', 'admin', 'super_admin'], default: 'user' },
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
  site: String,
  permissions: {
    manageAdmins: Boolean,
    manageTheme: Boolean,
    viewStats: Boolean,
    manageSite: Boolean
  },
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date
});

const User = mongoose.model('User', userSchema);
const { generateAdminClientFolder } = require('./src/utils/siteGenerator');

async function createAdmin() {
  try {
    // Check for command line arguments
    const args = process.argv.slice(2);
    let name = 'Super Admin Master';
    let email = 'superadmin@example.com';
    let password = 'SuperAdmin123!@#';
    let siteName = 'ShopMate';
    let role = 'super_admin';

    if (args.length >= 3) {
      name = args[0];
      email = args[1];
      password = args[2];
      siteName = args[3] || 'ShopMate';
      role = 'admin'; // If arguments passed, assume creating a sub-admin
    }

    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://raidreus22_db_user:FWSv9QMN7aic8kbS@cluster0.mrynveq.mongodb.net/';
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log('✅ Connected to MongoDB\n');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log('⚠️  Admin already exists with this email');
      console.log(`📧 Email: ${email}`);
      console.log(`🔐 Password: ${password}`);
      mongoose.connection.close();
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin
    const admin = new User({
      name,
      email,
      password: hashedPassword,
      role: role,
      status: 'active',
      site: siteName,
      permissions: {
        manageAdmins: role === 'super_admin',
        manageTheme: true,
        viewStats: true,
        manageSite: true
      }
    });

    await admin.save();

    console.log(`✅ ${role === 'super_admin' ? 'Super Admin' : 'Admin'} Created Successfully!\n`);
    
    // Generate folder
    const slug = siteName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const config = {
      siteName: siteName,
      description: `Welcome to ${siteName}`,
      admin: admin._id
    };
    
    generateAdminClientFolder(slug, email, password, config);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    ' + email);
    console.log('🔐 Password: ' + password);
    console.log('🎯 Role:     ' + role);
    console.log('📁 Store:    ' + slug);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error:', err.message);
    mongoose.connection.close();
    process.exit(1);
  }
}

createAdmin();
