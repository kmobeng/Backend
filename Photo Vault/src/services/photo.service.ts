import mongoose, { Types } from "mongoose";
import Photo, { IPhoto } from "../model/photo.model";
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

    const populatedPhoto: any = await photo.populate("user");

    RedisClient.del(`photos:${userId}:${populatedPhoto.user.username}`);

    if (!photo) {
      throw createError("Unable to create photo", 400);
    }
    return photo;
  } catch (error) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (deleteError) {
      throw createError(
        "Unable to cleanup cloudinary after upload photo failed",
        400
      );
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
  const photosKey = `photos:${userId}:${username}`;

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

export const getSinglePhotoService = async (photoId: any, userId: string) => {
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

    const photo = await Photo.findOne({ _id: photoId }).populate("user");
    if (photo !== null) {
      RedisClient.setex(photoKey, 3600, JSON.stringify(photo));
    }

    if (
      photo?.user._id.toString() !== userId &&
      photo?.visibility === "private"
    ) {
      return null;
    }

    return photo;
  } catch (error) {
    throw error;
  }
};

export const updatePhotoService = async (
  title: string,
  visibility: string,
  photoId: any,
  userId: string
) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(photoId)) {
      throw createError("Invalid photo ID", 400);
    }

    const photo = await Photo.findOneAndUpdate(
      { user: userId, _id: photoId },
      { $set: { title, visibility } },
      { new: true, runValidators: true }
    );

    if (!photo) {
      throw createError("Unable to update photo", 400);
    }
    return photo;
  } catch (error) {
    throw error;
  }
};

export const deletePhotoService = async (photoId: any, userId: string) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(photoId)) {
      throw createError("Invalid photo ID", 400);
    }
    const photo: any = await Photo.findOne({ user: userId, _id: photoId });
    if (!photo) {
      throw createError("Unable to delete photo", 400);
    }
    try {
      await cloudinary.uploader.destroy(photo?.publicId);
    } catch (error) {
      throw createError("Unable to delete from cloudinary", 400);
    }
    const deletedPhoto = await Photo.findByIdAndDelete(photo._id);

    return deletedPhoto;
  } catch (error) {
    throw error;
  }
};
