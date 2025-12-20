import User from "../model/user.model";
import { createError } from "../utils/error.util";

export const signUpService = async (
  name: string,
  email: string,
  password: string,
  passwordConfirm: string,
  role: string
) => {
  try {
    const user = await User.create({
      name,
      email,
      password,
      passwordConfirm,
      role,
    });
    if (!user) {
      throw createError("Error while creating user", 400);
    }
    return user;
  } catch (error) {
    throw error;
  }
};
