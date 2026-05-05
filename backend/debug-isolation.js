const mongoose = require('mongoose');
require('dotenv').config();
const { User, Product, Category } = require('./src/models/index.js');

async function debugIsolation() {
  try {
    console.log('Connecting to DB...');
    await mongoose.connect(process.env.MONGO_URI);
    
    const admins = await User.find({ role: 'admin' }).limit(2);
    if (admins.length < 2) {
      console.log('Need at least 2 admins to test isolation. Found: ' + admins.length);
      process.exit(0);
    }

    const admin1 = admins[0];
    const admin2 = admins[1];

    console.log(`Admin 1: ${admin1.email} (${admin1._id})`);
    console.log(`Admin 2: ${admin2.email} (${admin2._id})`);

    // Check products in DB
    const p1Count = await Product.countDocuments({ adminId: admin1._id });
    const p2Count = await Product.countDocuments({ adminId: admin2._id });
    const totalP = await Product.countDocuments({});

    console.log(`\nDB Stats:`);
    console.log(`Total Products: ${totalP}`);
    console.log(`Products for Admin 1: ${p1Count}`);
    console.log(`Products for Admin 2: ${p2Count}`);

    // If counts are 0, checking for products with NO adminId
    const noAdminP = await Product.countDocuments({ adminId: { $exists: false } });
    const nullAdminP = await Product.countDocuments({ adminId: null });
    console.log(`Products with NO adminId: ${noAdminP}`);
    console.log(`Products with null adminId: ${nullAdminP}`);

    if (totalP > 0 && p1Count === 0 && p2Count === 0) {
      console.log('\n--- ATTEMPTING FIX: Assigning current products to Admin 1 ---');
      const result = await Product.updateMany(
        { $or: [{ adminId: { $exists: false } }, { adminId: null }] },
        { $set: { adminId: admin1._id } }
      );
      console.log(`Updated ${result.modifiedCount} products to belong to ${admin1.email}`);
      
      const catResult = await Category.updateMany(
        { $or: [{ adminId: { $exists: false } }, { adminId: null }] },
        { $set: { adminId: admin1._id } }
      );
      console.log(`Updated ${catResult.modifiedCount} categories to belong to ${admin1.email}`);

      const orderResult = await Order.updateMany(
        { $or: [{ adminId: { $exists: false } }, { adminId: null }] },
        { $set: { adminId: admin1._id } }
      );
      console.log(`Updated ${orderResult.modifiedCount} orders to belong to ${admin1.email}`);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

debugIsolation();
