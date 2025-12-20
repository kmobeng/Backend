import { Request, Response, NextFunction } from "express";
import { createError } from "../utils/error.util";
import { signUpService } from "../services/auth.service";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, passwordConfirm, role } = req.body;

    const user = await signUpService(
      name,
      email,
      password,
      passwordConfirm,
      role
    );

    const token = await user.signToken();

    res.status(201).json({ status: "success", token, data: { user } });
  } catch (error) {
    next(error);
  }
};
