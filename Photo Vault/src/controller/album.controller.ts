import { NextFunction, Request, Response } from "express";
import { createAlbumService } from "../services/album.service";
import { createError } from "../utils/error.util";

export const createAlbum = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;
    if (!name) {
      return createError("Please provide name of album", 400);
    }
    const album = await createAlbumService(name, req.user._id.toString());
    res.status(201).json({ status: "success", data: album });
  } catch (error) {
    next(error);
  }
};
