const express = require("express");
const morgan = require("morgan");
const expenseRoutes = require("./router/expense.route");
const { errorHandler } = require("./middleware/expense.middleware");
const userRoute = require("./router/user.route");

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use("/api/expense", expenseRoutes);
app.use("/api/users", userRoute);
app.use(errorHandler);

module.exports = app;
