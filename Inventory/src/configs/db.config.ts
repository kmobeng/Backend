import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async (): Promise<void> => {
  try {
    if (!process.env.DB_URL) {
      console.log("DB URL has not been provided");
    }

    await mongoose.connect(process.env.DB_URL!);
    console.log("Database is connected successfully");
  } catch (error) {
    console.log("Mongo DB connection failed", (error as Error).message);
    process.exit(1);
  }
};
