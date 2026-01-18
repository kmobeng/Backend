const express = require("express");
const morgan = require("morgan");
const qs = require("qs");
const tourRoutes = require("./routes/tourRoutes.route");
const userRoutes = require("./routes/userRoutes.route");
const AppError = require("./utils/error.utils");
const globalErroHandler = require("./controllers/error.controller");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const { xss } = require("express-xss-sanitizer");
const reviewRoutes = require("./routes/reviewRoutes.route");

const app = express();
app.set("query parser", "extended");
app.use(helmet());

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});

app.use("/api", limiter);
app.use(express.json({ limit: "10kb" }));
app.use(xss());

app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.query) mongoSanitize.sanitize(req.query);
  if (req.params) mongoSanitize.sanitize(req.params);
  next();
});
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsAverage",
      "ratingsQuantity",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);
app.use(express.static(`${__dirname}/public`));

app.use("/api/tours", xss(), tourRoutes);
app.use("/api/users", xss(), userRoutes);
app.use("/api/reviews", xss(), reviewRoutes);

app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`));
});

app.use(globalErroHandler);

module.exports = app;
