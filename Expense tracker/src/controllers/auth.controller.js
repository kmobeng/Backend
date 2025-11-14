const logger = require("../config/logger.config");
const { signupService } = require("../services/auth.service");

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    logger.info("User signup attempt", { name, email });

    const user = await signupService(name, email, password, passwordConfirm);

    logger.info("User signed up successfully", {
      userId: user._id,
      name: user.name,
      email: user.email,
    });

    const token = user.signToken();

    res.status(201).json({ status: "success", token, data: user });
  } catch (error) {
    logger.error("Signup error", {
      error: error.message,
      stack: error.stack,
      email: req.body.email,
      name: req.body.name,
    });
    next(error);
  }
};
