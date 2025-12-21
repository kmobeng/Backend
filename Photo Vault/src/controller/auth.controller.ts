import { Request, Response, NextFunction } from "express";
import { createError } from "../utils/error.util";
import { loginService, signUpService } from "../services/auth.service";
import JWT from "jsonwebtoken";
import User from "../model/user.model";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw createError("Please enter email and password", 400);
    }

    const fetchedUser = await loginService(email, password);
    const token = fetchedUser.signToken();

    const user: any = fetchedUser.toObject();
    delete user.password;

    res.status(200).json({ status: "success", token, data: { user } });
  } catch (error) {
    next(error);
  }
};

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: any;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw createError("You are not logged in. Please login to continue", 401);
    }

    const decoded: any = JWT.verify(token, process.env.JWT_SECRET!);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      throw createError("The user with this token does not exist", 404);
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      throw createError("Password changed. Please login again", 400);
    }

    (req as any).user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};
