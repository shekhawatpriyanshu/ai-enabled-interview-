const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to:", mongoose.connection.name);
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log("Collections:", collections.map(c => c.name));
  
  const Resume = mongoose.connection.db.collection('resumes');
  const count = await Resume.countDocuments();
  console.log("Resumes count:", count);
  
  process.exit(0);
}
check();
