import { Request, Response, NextFunction } from "express";
import { cloudinary, RedisClient } from "../config/db.config";
import {
  getAllPhotosService,
  uploadPhotoService,
} from "../services/photo.service";

interface QueryString {
  page?: string | number;
  sort?: string;
  limit?: string | number;
  fields?: string;
}

declare global {
  namespace Express {
    interface Request {
      queryString: QueryString;
    }
  }
}

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
      req.queryString
    );

    if (photos.length === 0) {
      return res.status(200).json({ message: "No photos found" });
    }
    res.status(200).json({ status: "success", data: { photos } });
  } catch (error) {
    next(error);
  }
};
