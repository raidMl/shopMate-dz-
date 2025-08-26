const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables. Please check your .env file.');
    }
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
    
    // Drop old indexes that are no longer needed
    try {
      const db = conn.connection.db;
      
      // Drop the old id index from categories collection
      await db.collection('categories').dropIndex('id_1').catch(() => {
        console.log('id_1 index not found in categories collection (this is fine)');
      });
      
      // Drop the old id index from products collection
      await db.collection('products').dropIndex('id_1').catch(() => {
        console.log('id_1 index not found in products collection (this is fine)');
      });
      
      console.log('Old indexes cleaned up successfully');
    } catch (indexError) {
      console.log('Index cleanup completed (some indexes may not have existed)');
    }
    
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
