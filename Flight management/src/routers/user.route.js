const { Router } = require("express");
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
} = require("../controller/auth.controller");

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
