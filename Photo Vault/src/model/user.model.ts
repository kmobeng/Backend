import { Document, model, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  createdAt: Date;
  role: string;
  passwordChangedAt: Date;

  signToken(): string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: [true, "name is required"] },
  email: {
    type: String,
    unique: true,
    required: [true, "email is required"],
    validate: {
      validator: function (value: string) {
        return validator.isEmail(value);
      },
      message: "Please provide a valid email",
    },
  },
  password: {
    type: String,
    required: [true, "You must provide password"],
    minlength: [8, "Password is should be 8 characters or more"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "You must confirm password"],
    validate: {
      validator: function (this: any, value: string): boolean {
        return value === this.password;
      },
      message: "Password must match",
    },
  },
  role: { type: String, default: "user", enum: ["user", "admin"] },
  passwordChangedAt: Date,
});

UserSchema.pre("save", async function (this: any) {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

UserSchema.methods.signToken = function () {
  return JWT.sign({ id: this._id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN!,
  } as JWT.SignOptions);
};

UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

export default model<IUser>("User", UserSchema);
