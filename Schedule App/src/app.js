const express = require("express");
const morgan = require("morgan");
const { errorHandler } = require("./middleware/schedule.middleware");
const UserRoute = require("./router/user.route");
const scheduleRoute = require("./router/schedule.route");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use("/api/users/", UserRoute);
app.use("/api/schedule/", scheduleRoute);

app.use(errorHandler);
module.exports = app;
