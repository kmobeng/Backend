const { createError, signToken } = require("../utils/flight.util");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const JWT = require("jsonwebtoken");
const logger = require("../config/logger.config");

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      role: req.body.role,
    });

    const token = signToken(newUser._id);

    newUser.password = undefined;
    logger.info("User signup successful", {
      userId: newUser._id,
      email: newUser.email,
      role: newUser.role,
    });

    res.status(201).json({
      status: "success",
      token,
      data: newUser,
      message: "sign up successful",
    });
  } catch (error) {
    logger.error("Failed to signup", {
      email: req.body.email,
      error: error.message,
    });
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      logger.warn("Missing credentials", { email });
      throw createError("Please provide email and password", 401);
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      logger.warn("Invalid credentials", { email });
      throw createError("Incorrect email or password", 401);
    }
    const token = signToken(user._id);

    logger.info("Login successful", {
      userId: user._id,
      email: user.email,
    });

    res.status(200).json({
      status: "success",
      token,
      message: "log in successful",
    });
  } catch (error) {
    logger.error("Failed to login", {
      email: req.body.email,
      error: error.message,
    });
    next(error);
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      logger.warn("No token provided");
      throw createError(
        "You are not logged in. Please login to get authorized",
        401
      );
    }
    const decoded = await promisify(JWT.verify)(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      logger.warn("User not found", { userId: decoded.id });
      throw createError("This user does no longer exist", 400);
    }

    if (user.changedPasswordAfter(decoded.iat)) {
      logger.warn("Password changed", {
        userId: user._id,
        email: user.email,
      });
      throw createError("User has changed password. Please login again!");
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error("Protected route access denied", { error: error.message });
    next(error);
  }
};

exports.restrictTo = () => {
  return (req, res, next) => {
    if (req.user.role === "user") {
      logger.warn("Insufficient permissions", {
        userId: req.user._id,
        email: req.user.email,
        role: req.user.role,
      });
      throw createError(
        "You do not have permisson to perform this action",
        403
      );
    }
    next();
  };
};
