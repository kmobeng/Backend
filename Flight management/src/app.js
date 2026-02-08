const express = require("express");
const morgan = require("morgan");
const { errorHandler } = require("./middleware/flight.middleware");
const UserRoute = require("./routers/user.route");
const FlightRoute = require("./routers/flight.route");
const BookingRoute = require("./routers/booking.route");

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use("/api/auth", UserRoute);
app.use("/api/flight/", FlightRoute);
app.use("/api/bookings", BookingRoute);
app.use(errorHandler);

module.exports = app;
