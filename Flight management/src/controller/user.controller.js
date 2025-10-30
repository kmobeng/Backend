const mongoose = require("mongoose");
const { createError } = require("../utils/error.util");
const User = require("../models/user.model");
const JWT = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = JWT.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRESIN,
    });

    res.status(201).json({ status: "success", token, data: newUser });
  } catch (error) {
    next(createError("error while signing up", 401));
  }
};
