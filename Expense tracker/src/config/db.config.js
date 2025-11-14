const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Error while connecting database", error);
    process.exit(1);
  }
}

module.exports = { connectDB };
