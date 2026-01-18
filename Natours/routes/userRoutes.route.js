const express = require("express");
const {
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  createUser,
  updateMe,
  deleteMe,
  getMe,
} = require("../controllers/users.controller");
const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
  restrictTo,
} = require("../controllers/auth.controller");

const userRoutes = express.Router();

userRoutes.post("/signup", signUp);
userRoutes.post("/login", login);
userRoutes.post("/forgotPassword", forgotPassword);
userRoutes.patch("/resetPassword/:token", resetPassword);

userRoutes.use(protect);

userRoutes.patch("/updateMyPassword", updatePassword);
userRoutes.get("/me", getMe, getUser);
userRoutes.patch("/updateMe", updateMe);
userRoutes.delete("/deleteMe", deleteMe);

userRoutes.use(restrictTo("admin"));

userRoutes.route("/").get(getAllUsers).post(createUser);
userRoutes.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = userRoutes;
