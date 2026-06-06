import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = async () => {
    try{
        const MONGO_URI = process.env.MONGO_URI ;
        await mongoose.connect(MONGO_URI!);
        console.log("Connected to MongoDB");
    }catch(error){
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

