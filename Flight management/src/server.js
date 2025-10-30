const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db.config");
dotenv.config();

const startServer = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT, () => {
      console.log("server has started");
    });
  } catch (error) {
    console.log("Failed to start server");
    process.exit(1);
  }
};

startServer();
