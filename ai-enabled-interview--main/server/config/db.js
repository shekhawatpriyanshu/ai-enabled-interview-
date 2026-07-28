const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('MongoDB Connected');

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err.message);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected.');
        });
    } catch (error) {
        console.error(error.message)
        process.exit(1)
    }
}
module.exports = connectDB;