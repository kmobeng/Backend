const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
process.on("uncaughtException", (err) => {
  console.log("uncaught exceptions! shutting down....");
  console.log(err.name, err.message);
  process.exit(1);
});
const app = require("./app");

const DB = process.env.DB_URL.replace("PASSWORD", process.env.DB_PASSWORD);
mongoose.connect(DB).then(() => console.log("database connected successfully"));
// .catch(() => console.log("error when connecting database", error));

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("unhandled rejections! shutting down.....");
  server.close(() => {
    process.exit(1);
  });
});
