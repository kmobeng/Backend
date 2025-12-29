import { Request, Response, NextFunction } from "express";
import { cloudinary } from "../config/db.config";
import {
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
    const { title, description, visibility, albumId } = req.body;
    const photo = req.file;
    const userId = req.user._id.toString();

    const uploadResult = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "photo-vault",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      stream.end(photo!.buffer);
    });

    const url = uploadResult.secure_url;
    const photoResult = await uploadPhotoService(
      title,
      description,
      visibility,
      url,
      userId,
      albumId,
      uploadResult.public_id
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
    const photo = await getSinglePhotoService(photoId, req.user._id.toString());

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

    const photo = await updatePhotoService(
      title,
      visibility,
      photoId,
      req.user._id.toString()
    );

    res.status(200).json({ status: "success", data: photo });
  } catch (error) {
    next(error);
  }
};
