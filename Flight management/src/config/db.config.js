const mongoose = require("mongoose");
const dotenv = require("dotenv");
const logger = require("./logger.config");
dotenv.config();

exports.connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    logger.info("Database connected successfully");
  } catch (error) {
    logger.error("Failed to connect to database", { error: error.message });
    process.exit(1);
  }
};
