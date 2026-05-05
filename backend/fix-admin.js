const mongoose = require('mongoose');
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

async function checkAndFixAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://raidreus22_db_user:FWSv9QMN7aic8kbS@cluster0.mrynveq.mongodb.net/';
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log('✅ Connected to MongoDB\n');

    const email = 'raidreus.22@mail.com';

    // Check current admin
    const admin = await User.findOne({ email });
    
    if (!admin) {
      console.log('❌ Admin not found with email: ' + email);
      mongoose.connection.close();
      return;
    }

    console.log('📋 Current Admin Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:  ' + admin.email);
    console.log('🎯 Role:   ' + admin.role);
    console.log('📊 Status: ' + admin.status);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Fix the role if needed
    if (admin.role !== 'super_admin') {
      console.log('🔧 Fixing role to super_admin...');
      
      await User.updateOne(
        { email },
        {
          $set: {
            role: 'super_admin',
            status: 'active',
            permissions: {
              manageAdmins: true,
              manageTheme: true,
              viewStats: true,
              manageSite: true
            }
          }
        }
      );

      console.log('✅ Admin updated to super_admin!\n');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 Email:       ' + email);
      console.log('🎯 Role:        super_admin ✅');
      console.log('📊 Status:      active ✅');
      console.log('🔐 Permissions: All ✅');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    } else {
      console.log('✅ Admin role is already super_admin!');
    }

    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error:', err.message);
    mongoose.connection.close();
    process.exit(1);
  }
}

checkAndFixAdmin();
