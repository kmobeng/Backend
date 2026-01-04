import { Request, Response, NextFunction } from "express";
import {
  deletePhotoService,
  getAllPhotosService,
  getSinglePhotoService,
  updatePhotoService,
  uploadPhotoService,
} from "../services/photo.service";
import { createError } from "../utils/error.util";

export const uploadPhoto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, visibility } = req.body;
    const { username, albumId } = req.params;
    const photo = req.file;
    const userId = req.user._id.toString();

    const photoResult = await uploadPhotoService(
      username as string,
      title,
      description,
      visibility,
      userId,
      photo,
      albumId?.toString()
    );

    res.status(201).json({ status: "success", data: { photo: photoResult } });
  } catch (error) {
    next(error);
  }
};

export const getAllPhotos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const username = req.params.username || req.user.username;

    const photos = await getAllPhotosService(
      username,
      req.user._id.toString(),
      req.query
    );

    if (photos.length === 0) {
      return res.status(200).json({ message: "No photos found" });
    }
    res
      .status(200)
      .json({ status: "success", result: photos.length, data: { photos } });
  } catch (error) {
    next(error);
  }
};

export const getSinglePhoto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { photoId } = req.params;
    if (!photoId) {
      throw createError("No photo id provided", 400);
    }
    const { username } = req.params;
    if (!username) {
      throw createError("No photo id provided", 400);
    }
    const photo = await getSinglePhotoService(
      photoId,
      req.user._id.toString(),
      username
    );

    if (photo === null) {
      return res.status(400).json({ message: "No photo found" });
    }
    res.status(200).json({ status: "success", data: photo });
  } catch (error) {
    next(error);
  }
};

export const updatePhoto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, visibility } = req.body;
    const { photoId } = req.params;
    const { username } = req.params;
    if (!photoId || !username) {
      throw createError("No username or photoID provided", 400);
    }

    const photo = await updatePhotoService(
      title,
      visibility,
      photoId,
      req.user._id.toString(),
      username
    );

    res.status(200).json({ status: "success", data: photo });
  } catch (error) {
    next(error);
  }
};

export const deletePhoto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { photoId, username } = req.params;
    if (!username || !photoId) {
      throw createError("Please provide username and photoId", 400);
    }

    const photo = await deletePhotoService(
      photoId,
      req.user._id.toString(),
      username as string
    );

    res.status(200).json({ status: "success" });
  } catch (error) {
    next(error);
  }
};
