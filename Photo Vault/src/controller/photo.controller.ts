import { Request, Response, NextFunction } from "express";
import { cloudinary } from "../config/db.config";
import { uploadPhotoService } from "../services/photo.service";

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
