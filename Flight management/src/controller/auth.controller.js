const { createError, signToken } = require("../utils/flight.util");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: "success",
      token,
      data: newUser,
      message: "sign up successful",
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw createError("Please provide email and password", 401);
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw createError("Incorrect email or password", 401);
    }
    const token = signToken(user._id);

    res.status(200).json({
      status: "success",
      token,
      message: "log in successful",
    });
  } catch (error) {
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
      return next(
        new AppError(
          "Your are not logged in. Please login to get authorized",
          401
        )
      );
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!freshUser) {
      throw createError("");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
