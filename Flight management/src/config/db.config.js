const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { createError } = require("../utils/flight.util");
dotenv.config();

exports.connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Database connected successfully");
  } catch (error) {
    console.log(error);
    console.log("failed to connect to database");
    process.exit(1);
  }
};
