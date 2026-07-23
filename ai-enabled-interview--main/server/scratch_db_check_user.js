const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

async function checkAll() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const User = mongoose.connection.db.collection('users');
  const users = await User.find().toArray();
  
  console.log(`Total users: ${users.length}`);
  
  for (const u of users) {
    const dbColl = mongoose.connection.db.collection('interviewsessions');
    const dbCollRes = mongoose.connection.db.collection('resumes');
    
    const countI = await dbColl.countDocuments({ user: u._id });
    const countR = await dbCollRes.countDocuments({ user: u._id });
    
    if (countI > 0 || countR > 0) {
      console.log(`Email: ${u.email} -> interviewsessions: ${countI}, resumes: ${countR}`);
    }
  }

  process.exit(0);
}
checkAll();
