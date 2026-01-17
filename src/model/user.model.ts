import mongoose, { InferSchemaType, model , Document} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

export interface IUserMethods {
  signToken(): string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    min: 8,
    required: [true, "Password is required"],
    select: false,
  },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.pre("save", async function (this: any) {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

UserSchema.methods.signToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN!,
  } as jwt.SignOptions);
};

UserSchema.methods.comparePassword = async function (
  this: IUser,
  candidatePassword: string
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export type IUser = InferSchemaType<typeof UserSchema> &
  IUserMethods &
  Document;

const User = model<IUser>("User", UserSchema);

export default User;
