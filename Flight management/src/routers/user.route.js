const { Router } = require("express");
const {
  signup,
  login,
  forgotPassword,
} = require("../controller/auth.controller");

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);

module.exports = router;
