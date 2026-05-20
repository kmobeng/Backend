import app from "./app";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const startServer = async () => {
  try {
    try {
      await mongoose.connect(process.env.DATABASE_URL!);
      console.log("Connected to database successfully!");
    } catch (error) {
      console.log("Error connecting to Database,", error);
      process.exit(1);
    }

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Error starting Server,", error);
  }
};

startServer();
