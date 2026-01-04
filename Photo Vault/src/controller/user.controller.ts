import { NextFunction, Request, Response } from "express";
import { getAllUsersService } from "../services/user.service";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await getAllUsersService();
    res
      .status(200)
      .json({ status: "success", result: users.length, data: users });
  } catch (error) {}
};
