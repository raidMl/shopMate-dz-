const mongoose = require('mongoose');
require('dotenv').config();

async function testAdmins() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected!');

    // Get the User model
    const { User } = require('./src/models/index.js');

    console.log('\n📋 Finding all users with admin or super_admin role...');
    const admins = await User.find({ role: { $in: ['admin', 'super_admin'] } }).select('-password');

    if (admins.length === 0) {
      console.log('❌ No admins found!');
    } else {
      console.log(`✅ Found ${admins.length} admin(s):`);
      admins.forEach(admin => {
        console.log(`  - ${admin.name} (${admin.email}) - Role: ${admin.role} - Status: ${admin.status}`);
      });
    }

    // Also count all users
    const allUsers = await User.countDocuments();
    const userCount = await User.countDocuments({ role: 'user' });
    
    console.log(`\n📊 Total Statistics:`);
    console.log(`  - Total users: ${allUsers}`);
    console.log(`  - Regular users: ${userCount}`);
    console.log(`  - Admin users: ${admins.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testAdmins();
