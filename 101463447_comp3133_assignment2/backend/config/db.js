require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI); // No extra options needed
        console.log("✅ MongoDB Atlas Connected");
    } catch (error) {
        console.error("❌ Database Connection Error:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
