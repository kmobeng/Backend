const { Router } = require("express");
const { signup } = require("../controllers/auth.controller");

const userRoute = Router();

userRoute.post("/signup", signup);

module.exports = userRoute;
