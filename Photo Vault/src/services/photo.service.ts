import mongoose from "mongoose";
import Photo from "../model/photo.model";
import { createError } from "../utils/error.util";
import { cloudinary } from "../config/db.config";

export const uploadPhotoService = async (
  title: string,
  description: string,
  visibility: string,
  url: string,
  userId: string,
  albumId: string,
  publicId: string
) => {
  try {
    if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
      throw createError("Invalid user id", 400);
    }
    if (albumId && !mongoose.Types.ObjectId.isValid(albumId)) {
      throw createError("Invalid album id", 400);
    }
    const photo = await Photo.create({
      title,
      description,
      visibility,
      url,
      publicId,
      user: userId,
      album: albumId,
    });

    if (!photo) {
      createError("Unable to create photo", 400);
    }
    return photo;
  } catch (error) {
    try {
      await cloudinary.uploader.destroy(publicId);
      console.log("Photo deleted from Cloudinary:");
    } catch (deleteError) {
      console.error("Failed to cleanup Cloudinary:", deleteError);
    }
    throw error;
  }
};

export const getAllPhotos = async (userId: string) => {
  try {
    const photos = await Photo.find({ user: userId });
  } catch (error) {
    throw error;
  }
};
