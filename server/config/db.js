const mongoose = require('mongoose');

const connectDB = async () => {

  try {

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

  }
  catch (error) {

    console.error(`❌ MongoDB Error: ${error.message}`);

    // DO NOT crash Render server
    console.log("🔁 Retrying MongoDB connection in 5 seconds...");

    setTimeout(connectDB, 5000);

  }

};

module.exports = connectDB;