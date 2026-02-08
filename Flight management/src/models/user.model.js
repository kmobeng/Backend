const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"], trim: true },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: [true, "Email is required"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be 8 characters long"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Password is required"],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: "Passwords do not match",
    },
  },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now },
  passwordChangedAt: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log(resetToken, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};


const User = mongoose.model("User", userSchema);

module.exports = User;
