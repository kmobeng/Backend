const app = require("./app");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db.config");

dotenv.config();

const port = process.env.port;

async function startServer() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log("Server is running on port 4000");
    });
  } catch (error) {
    console.log("Unable to start server");
    process.exit(1);
  }
}

startServer();
