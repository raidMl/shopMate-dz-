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

async function createAdmin() {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://raidreus22_db_user:FWSv9QMN7aic8kbS@cluster0.mrynveq.mongodb.net/';
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log('✅ Connected to MongoDB\n');

    // Super Admin Email & Password
    const email = 'superadmin@example.com';
    const password = 'SuperAdmin123!@#';
    const name = 'Super Admin Master';

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

    // Create super admin
    const superAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: 'super_admin',
      status: 'active',
      permissions: {
        manageAdmins: true,
        manageTheme: true,
        viewStats: true,
        manageSite: true
      }
    });

    await superAdmin.save();

    console.log('✅ Super Admin Created Successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    ' + email);
    console.log('🔐 Password: ' + password);
    console.log('🎯 Role:     super_admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error:', err.message);
    mongoose.connection.close();
    process.exit(1);
  }
}

createAdmin();
