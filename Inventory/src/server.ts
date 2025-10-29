import app from "./app";
import dotenv from "dotenv";
import { connectDB } from "./configs/db.config";

dotenv.config();

const PORT = process.env.PORT;

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is listening on ${PORT}`);
    });
  } catch (error) {
    console.log("failed to start server", error);
    process.exit(1);
  }
}

startServer();
