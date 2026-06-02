const mongoose = require('mongoose');
const mongoUri = 'mongodb+srv://raidreus22_db_user:FWSv9QMN7aic8kbS@cluster0.mrynveq.mongodb.net/';

async function fixLinks() {
  await mongoose.connect(mongoUri);
  const SiteConfig = mongoose.model('SiteConfig', new mongoose.Schema({ 
    admin: mongoose.Schema.Types.ObjectId, 
    logo: String 
  }, { collection: 'siteconfigs' }));

  const configs = await SiteConfig.find({});
  for (const config of configs) {
    if (config.logo && config.logo.includes('mediafire.com/view/')) {
      const fixed = config.logo.replace('/view/', '/file/');
      await SiteConfig.updateOne({ _id: config._id }, { $set: { logo: fixed } });
      console.log(`✅ Fixed logo link for admin ${config.admin}: ${fixed}`);
    }
  }
  
  console.log('Done!');
  process.exit();
}

fixLinks().catch(console.error);