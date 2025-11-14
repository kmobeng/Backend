const User = require("../model/user.model");
const mongoose = require("mongoose");
const { createError } = require("../utils/expense.util");

exports.signupService = async (name, email, password, passwordConfirm) => {
  try {
    const user = await User.create({ name, email, password, passwordConfirm });

    if (!user) {
      throw createError(400, "Unable to create user");
    }

    return user;
  } catch (error) {
    throw error;
  }
};
