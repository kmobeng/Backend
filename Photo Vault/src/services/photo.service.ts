import mongoose, { ObjectId, Types } from "mongoose";
import Photo from "../model/photo.model";
import { createError } from "../utils/error.util";
import { cloudinary, RedisClient } from "../config/db.config";
import User from "../model/user.model";
import APIFeatures from "../utils/APIFeatures.util";

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

    RedisClient.del(`photos:${userId}`);

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

export const getAllPhotosService = async (
  username: string,
  userId: string,
  queryString: any
) => {
  const userKey = `user:${userId}`;
  const photosKey = `photos:${userId}`;

  try {
    const cachedPhotos = await RedisClient.get(photosKey);

    if (cachedPhotos) {
      console.log("Photos cache hit");
      return JSON.parse(cachedPhotos);
    }

    console.log("Photos cache miss");

    let user;
    const cachedUser = await RedisClient.get(userKey);

    if (cachedUser) {
      console.log("User cache hit");
      user = JSON.parse(cachedUser);
    } else {
      console.log("User cache miss");
      user = await User.findOne({ username }).select("_id username").lean();

      if (!user) {
        throw createError("Error fetching photos", 404);
      }

      await RedisClient.setex(userKey, 86400, JSON.stringify(user));
    }

    if (user._id !== userId) {
      let setVisibility = "private";
    }

    const features = new APIFeatures(
      Photo.find({ user: user._id }),
      queryString
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const photos = await features.query;

    if (photos.length > 0) {
      await RedisClient.setex(photosKey, 3600, JSON.stringify(photos));
    }

    return photos;
  } catch (error) {
    throw error;
  }
};
