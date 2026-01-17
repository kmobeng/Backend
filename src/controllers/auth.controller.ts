import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../model/user.model";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

interface JWTPayload {
  id: string;
  iat: number;
  exp: number;
}

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({status: "fail", messagae:"Provide name , email and password"})
    }

     const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: "fail",
        message: "User with this email already exists",
      });
    }

    const fetchedUser = await User.create({
      name,
      email,
      password,
    });
    if (!fetchedUser) {
      return res
        .status(400)
        .json({ status: "fail", message: "Error while signing up" });
    }

    const token = fetchedUser.signToken();

    const user: any = fetchedUser.toObject();
    delete user.password;

    return res.status(201).json({ status: "success", token, data: { user } });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "fail", message: "Internal Server Error" });
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: "fail", message: "Please enter email and password" });
    }

    const fetchedUser = await User.findOne({ email }).select("+password");
    if (!fetchedUser || !(await fetchedUser.comparePassword(password))) {
      return res
        .status(400)
        .json({ staus: "fail", message: "email or password is incorrect" });
    }
    const token = fetchedUser.signToken();

    const user: any = fetchedUser.toObject();
    delete user.password;

    return res.status(200).json({ status: "success", token, data: { user } });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "fail", message: "Internal Server Error" });
  }
};

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let token: any;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(401).json({
        status: "succes",
        message: "You are not logged in. Please login to continue",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    const currentUser = await User.findById(decoded.id).select("+password");

    if (!currentUser) {
      res.status(404).json({
        status: "fail",
        message: "The user with this token does not exist",
      });
    }

    req.user = currentUser as IUser

    next();
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Internal Server Error" });
  }
};
