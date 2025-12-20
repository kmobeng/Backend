const User = require("../models/user.model");
const { createError } = require("../utils/error.util");

exports.signupService = async (name, email, password, passwordConfirm) => {
  try {
    const user = await User.create({ name, email, password, passwordConfirm });
    return user;
  } catch (error) {
    throw error;
  }
};

exports.loginService = async (email, password) => {
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      throw createError("Incorrect email or password", 404);
    }
    return user;
  } catch (error) {
    throw error;
  }
};
