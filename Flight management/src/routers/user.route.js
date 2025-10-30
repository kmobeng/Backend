const { Router } = require("express");
const { signup } = require("../controller/user.controller");

const router = Router();

router.post("/signup", signup);

module.exports = router;
