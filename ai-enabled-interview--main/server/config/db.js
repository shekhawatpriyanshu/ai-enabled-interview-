const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://shekhawt808:Shekhawat%40807@cluster0.yf6bu.mongodb.net/aip?retryWrites=true&w=majority';
  
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB Connected to Cloud Atlas successfully');
  } catch (error) {
    console.error('\n⚠️  MongoDB Connection Warning:', error.message);
    console.error('👉 Cause: Your current IP address is not whitelisted on MongoDB Atlas, or network timed out.');
    console.error('👉 Solution: Go to MongoDB Atlas -> Network Access -> Add IP Address -> Add 0.0.0.0/0 (Allow access from anywhere).\n');

    // Auto retry connecting in the background without crashing nodemon
    setTimeout(() => {
      console.log('🔄 Retrying MongoDB connection in background...');
      connectDB().catch(() => {});
    }, 10000);
  }

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected.');
  });
};

module.exports = connectDB;