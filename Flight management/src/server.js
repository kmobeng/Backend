const app = require("./app");
const dotenv = require("dotenv");
const logger = require("./config/logger.config");
const { connectDB } = require("./config/db.config");
dotenv.config();

const startServer = async () => {
  try {
    logger.info("Starting flight management server...");
    await connectDB();
    app.listen(process.env.PORT, () => {
      logger.info("Server has started");
    });
  } catch (error) {
    logger.error("Failed to start server", { error });
    process.exit(1);
  }
};

startServer();
