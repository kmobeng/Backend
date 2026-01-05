import mongoose, { Types } from "mongoose";
import Photo from "../model/photo.model";
import { createError } from "../utils/error.util";
import { cloudinary, RedisClient } from "../config/db.config";
import User from "../model/user.model";
import APIFeatures from "../utils/APIFeatures.util";

export const uploadPhotoService = async (
  title: string,
  description: string,
  visibility: string,
  userId: string,
  photo: any,
  albumId?: any
) => {
  let publicId;
  try {
    if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
      throw createError("Invalid user id", 400);
    }
    if (albumId && !mongoose.Types.ObjectId.isValid(albumId)) {
      throw createError("Invalid album id", 400);
    }

    if (!photo || !photo.buffer) {
      throw createError("No photo file provided", 400);
    }

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

      stream.end(photo.buffer);
    });

    const url = uploadResult.secure_url;
    publicId = uploadResult.public_id;

    const createdPhoto = await Photo.create({
      title,
      description,
      visibility,
      url,
      publicId,
      user: userId,
      album: albumId,
    });

    const keys = await RedisClient.keys(`photos:*`);
    if (keys.length > 0) {
      await RedisClient.del(...keys);
    }

    if (!createdPhoto) {
      throw createError("Unable to create photo", 400);
    }
    return createdPhoto;
  } catch (error) {
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
        console.log("Cloudinary cleanup successful");
      } catch (deleteError) {
        console.error("Failed to cleanup Cloudinary:", deleteError);
      }
    }
    throw error;
  }
};

export const getAllPhotosService = async (
  username: string,
  userId: string,
  queryString: any
) => {
  const userKey = `user:${userId}:${username}`;
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

export const getSinglePhotoService = async (
  photoId: any,
  userId: string,
  username: string
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

    const photo = await Photo.findOne({ _id: photoId }).populate({
      path: "user",
      select: "_id username",
    });
    if (!photo) {
      throw createError("Error while fetching photo", 400);
    }
    const populatedUser = photo?.user as any;
    if (username !== populatedUser.username) {
      throw createError("Error while fetching photo", 400);
    }
    if (
      photo?.user._id.toString() !== userId &&
      photo?.visibility === "private"
    ) {
      return null;
    }
    if (photo !== null) {
      RedisClient.setex(photoKey, 3600, JSON.stringify(photo));
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
  userId: string,
  username: string
) => {
  const userKey = `user:${userId}:${username}`;

  try {
    if (!mongoose.Types.ObjectId.isValid(photoId)) {
      throw createError("Invalid photo ID", 400);
    }
    let user;
    const cachedUser = await RedisClient.get(userKey);
    if (cachedUser) {
      user = JSON.parse(cachedUser);
    } else {
      user = await User.findOne({ _id: userId }).select("_id username");
      await RedisClient.setex(userKey, 86400, JSON.stringify(user));
    }

    if (username !== user.username) {
      throw createError("Error while updating photo", 400);
    }
    const photo: any = await Photo.findOneAndUpdate(
      { user: user._id, _id: photoId },
      { $set: { title, visibility } },
      { new: true, runValidators: true }
    );
    if (!photo) {
      throw createError("Unable to update photo", 400);
    }
    const photosKey = await RedisClient.keys(`photos:*:${user.username}`);
    const photoKey = await RedisClient.keys(`photo:*:${photoId}`);

    if (photosKey.length !== 0) {
      await RedisClient.del(...photosKey);
    }
    if (photoKey.length !== 0) {
      await RedisClient.del(...photoKey);
    }

    return photo;
  } catch (error) {
    throw error;
  }
};

export const deletePhotoService = async (
  photoId: any,
  userId: string,
  username: string
) => {
  const userKey = `user:${userId}:${username}`;
  try {
    if (!mongoose.Types.ObjectId.isValid(photoId)) {
      throw createError("Invalid photo ID", 400);
    }
    let user;
    const cachedUser = await RedisClient.get(userKey);
    if (cachedUser) {
      user = JSON.parse(cachedUser);
    } else {
      user = await User.findOne({ _id: userId }).select("_id username");
      await RedisClient.setex(userKey, 86400, JSON.stringify(user));
    }
    if (username !== user.username) {
      throw createError("Error while deleting photo", 400);
    }

    const photo: any = await Photo.findOne({
      user: userId,
      _id: photoId,
    }).populate({ path: "user", select: "_id username" });
    if (!photo) {
      throw createError("Unable to delete photo", 400);
    }

    try {
      await cloudinary.uploader.destroy(photo?.publicId);
    } catch (error) {
      throw createError("Unable to delete from cloudinary", 400);
    }

    const photosKey = await RedisClient.keys(`photos:*:${photo.user.username}`);
    const photoKey = await RedisClient.keys(`photo:*:${photoId}`);

    if (photosKey.length !== 0) {
      await RedisClient.del(...photosKey);
    }
    if (photoKey.length !== 0) {
      await RedisClient.del(...photoKey);
    }

    const deletedPhoto = await Photo.findByIdAndDelete(photo._id);

    return deletedPhoto;
  } catch (error) {
    throw error;
  }
};
