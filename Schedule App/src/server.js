const app = require("./app");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db.config");
const logger = require("./config/winston.config");
const { scheduler } = require("./utils/scheduler.util");
dotenv.config();

const port = process.env.PORT;

const startServer = async () => {
  try {
    await connectDB();
    scheduler();
    app.listen(port, () => {
      logger.info(`server is running on port ${port}`);
    });
  } catch (error) {
    logger.error("unable to start server", error);
    process.exit(1);
  }
};

startServer();
