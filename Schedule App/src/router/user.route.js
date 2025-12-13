const { Router } = require("express");
const { signup, login } = require("../controller/auth.controller");

const UserRoute = Router();

UserRoute.post("/signup", signup);
UserRoute.get("/login", login);

module.exports = UserRoute;
