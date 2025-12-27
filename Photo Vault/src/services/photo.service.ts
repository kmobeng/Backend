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
  const userKey = `user:${username}`;
  const queryKey = JSON.stringify(queryString || {});
  const photosKey = `photos:${userId}:${username}:${queryKey}`;

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

    const filter: any = { user: user._id };

    if (user._id.toString() !== userId) {
      filter.visibility = "public";
      queryString.visibility = undefined;
    }

    const features = new APIFeatures(Photo.find(filter), queryString)
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

export const getSinglePhotoService = async (
  photoId: string,
  userId: string
) => {
  const photoKey = `photo:${userId}:${photoId}`;

  try {
    const cachedPhoto = await RedisClient.get(photoKey);

    if (cachedPhoto) {
      console.log("Photos cache hit");
      return JSON.parse(cachedPhoto);
    }

    console.log("Photos cache miss");
    if (!mongoose.Types.ObjectId.isValid(photoId)) {
      throw createError("Invalid photo ID", 400);
    }

    const photo = await Photo.findById({ photoId });
    if (photo === null) {
      RedisClient.setex(photoKey, 3600, JSON.stringify(photo));
    }
    return photo;
  } catch (error) {
    throw error;
  }
};
