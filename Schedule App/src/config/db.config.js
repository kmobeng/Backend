const mongoose = require("mongoose");
const dotenv = require("dotenv");
const logger = require("./winston.config");

dotenv.config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      serverSelectionTimeoutMS: 5000, // ⚠️ THIS IS CRITICAL - fails after 5 seconds
      socketTimeoutMS: 45000,
    });
    logger.info("database connected successfully");
  } catch (error) {
    logger.error("error while connecting to the database", error);
    process.exit(1);
  }
};

module.exports = { connectDB };
