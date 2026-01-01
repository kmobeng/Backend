const { signupService, loginService } = require("../service/auth.service");
const logger = require("../config/winston.config");
const { createError } = require("../utils/error.util");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;
    logger.info("User signup attempt", { name, email });

    const user = await signupService(name, email, password, passwordConfirm);
    const token = user.signToken();

    logger.info("User signup successful", { user: user._id, name, email });
    user.password = undefined;
    res.status(201).json({ status: "success", token, data: { user } });
  } catch (error) {
    logger.error("Error while signing up", {
      error: error.message,
      stack: error.stack,
      name: req.body.name,
      email: req.body.email,
    });
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      throw createError("Please provide email and password", 400);

    logger.info("User login attempt", { email, password });
    const user = await loginService(email, password);
    const token = user.signToken();

    logger.info("User login attempt successful", { user: user._id, email });
    user.password = undefined;
    res.status(200).json({ status: "success", token, data: { user } });
  } catch (error) {
    logger.error("Error while logging in", {
      error: error.message,
      stack: error.stack,
      name: req.body.name,
      email: req.body.email,
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
      logger.warn("no token found");
      throw createError("You are not logged in. Please log in", 401);
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      logger.warn("User does not exist", { userId: decoded.id });
      throw createError("The user with this token does not exist", 404);
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      logger.warn("Password changed. Please login again", {
        userId: currentUser._id,
        email: currentUser.email,
      });
      throw createError("Password changed. Please login again");
    }
    req.user = currentUser;
    next();
  } catch (error) {
    logger.error("Unauthorized route", { error: error.message });
    next(error);
  }
};
