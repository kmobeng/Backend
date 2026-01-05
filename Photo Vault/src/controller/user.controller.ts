import { NextFunction, Request, Response } from "express";
import {
  getAllUsersService,
  getSingleUserService,
} from "../services/user.service";
import { createError } from "../utils/error.util";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await getAllUsersService(req.query);
    res
      .status(200)
      .json({ status: "success", result: users.length, data: users });
  } catch (error) {}
};

export const getSingleUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      throw createError("No user Id provided", 400);
    }
    const user = await getSingleUserService(userId.toString());
    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    next(error);
  }
};
