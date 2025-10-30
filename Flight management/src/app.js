const express = require("express");
const morgan = require("morgan");
const { errorHandler } = require("./middleware/flight.middleware");
const UserRoute = require("./routers/user.route");

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use("/api/flight/", UserRoute);
app.use(errorHandler);

module.exports = app;
