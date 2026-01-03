import { NextFunction, Request, Response } from "express";
import {
  createAlbumService,
  getAllAlbumsService,
  getSingleAlbumService,
} from "../services/album.service";
import { createError } from "../utils/error.util";

export const createAlbum = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username } = req.params;
    const { name } = req.body;
    if (!name) {
      return createError("Please provide name of album", 400);
    }
    const album = await createAlbumService(
      name,
      req.user._id.toString(),
      username as string
    );
    res.status(201).json({ status: "success", data: album });
  } catch (error) {
    next(error);
  }
};

export const getAllAlbums = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username } = req.params;
    const albums = await getAllAlbumsService(
      username as string,
      req.user._id.toString(),
      req.query
    );
    if (albums.length < 1) {
      return res.status(400).json({ message: "No albums found" });
    }

    res
      .status(200)
      .json({ status: "success", result: albums.length, data: albums });
  } catch (error) {
    next(error);
  }
};

export const getSingleAlbum = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { albumId } = req.params;
    if (!albumId) {
      throw createError("No album id provided", 400);
    }

    const album = await getSingleAlbumService(albumId, req.user._id.toString());
    if (album === null) {
      return res.status(400).json({ message: "No album found" });
    }

    res.status(200).json({ status: "success", data: { album } });
  } catch (error) {
    next(error);
  }
};
