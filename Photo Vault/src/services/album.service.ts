import { RedisClient } from "../config/db.config";
import Album from "../model/album.model";
import { createError } from "../utils/error.util";
import User from "../model/user.model";
import APIFeatures from "../utils/APIFeatures.util";
import mongoose from "mongoose";

export const createAlbumService = async (
  name: string,
  userId: string,
  username: string
) => {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      throw createError("No user found", 400);
    }
    if (user._id.toString() !== userId) {
      throw createError("Error occured when creating photo", 400);
    }
    const album = await Album.create({ name, user: user._id });
    if (!album) {
      throw createError("Unable to create album", 400);
    }
    const albumsKeys = await RedisClient.keys(`album:*:${username}`);
    if (albumsKeys.length !== 0) {
      await RedisClient.del(...albumsKeys);
    }
    return album;
  } catch (error) {
    throw error;
  }
};

export const getAllAlbumsService = async (
  username: string,
  userId: string,
  queryString: any
) => {
  const userKey = `user:${userId}:${username}`;
  const albumsKey = `albums:${userId}:${username}`;
  try {
    const cachedAlbums = await RedisClient.get(albumsKey);

    if (cachedAlbums) {
      return JSON.parse(cachedAlbums);
    }

    let user;
    const cachedUser = await RedisClient.get(userKey);
    if (cachedUser) {
      user = JSON.parse(cachedUser);
    } else {
      user = await User.findOne({ username }).select("_id username").lean();
      if (!user) {
        throw createError("No user found", 400);
      }
      await RedisClient.setex(userKey, 86400, JSON.stringify(user));
    }

    const features = new APIFeatures(
      Album.find({ user: user._id }),
      queryString
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const albums = await features.query;

    if (albums.length > 0) {
      await RedisClient.setex(albumsKey, 3600, JSON.stringify(albums));
    }

    return albums;
  } catch (error) {
    throw error;
  }
};

export const getSingleAlbumService = async (
  albumId: string,
  userId: string,
  username: string
) => {
  const albumKey = `album:${userId}:${albumId}:`;
  try {
    const cachedAlbum = await RedisClient.get(albumKey);

    if (cachedAlbum) {
      return JSON.parse(cachedAlbum);
    }

    if (!mongoose.Types.ObjectId.isValid(albumId)) {
      throw createError("Invalid album ID", 400);
    }

    const album = await Album.findOne({ _id: albumId }).populate({
      path: "user",
      select: "_id username",
    });
    const populatedUser = album?.user as any;

    if (username !== populatedUser.username) {
      throw createError("Error while fetching photo", 400);
    }
    if (album !== null) {
      RedisClient.setex(albumKey, 3600, JSON.stringify(album));
    }
    return album;
  } catch (error) {
    throw error;
  }
};

export const updateSingleAlbumService = async (
  albumId: string,
  userId: string,
  name: string,
  username: string
) => {
  const userKey = `user:${userId}:${username}`;
  try {
    if (!mongoose.Types.ObjectId.isValid(albumId)) {
      throw createError("Invalid album ID", 400);
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

    const album = await Album.findOneAndUpdate(
      { _id: albumId, user: user._id },
      { $set: { name } },
      { new: true, runValidators: true }
    );

    if (!album) {
      throw createError("Error while updating album", 400);
    }
    const albumsKeys = await RedisClient.keys(`albums:*:${user.username}`);
    const albumKey = await RedisClient.keys(`album:*:${albumId}`);

    if (albumsKeys.length !== 0) {
      await RedisClient.del(...albumsKeys);
    }
    if (albumKey.length !== 0) {
      await RedisClient.del(...albumKey);
    }
    return album;
  } catch (error) {
    throw error;
  }
};

export const deleteSingleAlbumService = async (
  albumId: string,
  userId: string,
  username: string
) => {
  const userKey = `user:${userId}:${username}`;
  try {
    if (!mongoose.Types.ObjectId.isValid(albumId)) {
      throw createError("Invalid user ID", 400);
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

    const album: any = await Album.findOne({
      user: userId,
      _id: albumId,
    }).populate({ path: "user", select: "_id username" });
    if (!album) {
      throw createError("Unable to delete album", 400);
    }

    const albumsKeys = await RedisClient.keys(`albums:*:${user.username}`);
    const albumKeys = await RedisClient.keys(`album:*:${albumId}`);

    if (albumsKeys.length !== 0) {
      await RedisClient.del(...albumsKeys);
    }
    if (albumKeys.length !== 0) {
      await RedisClient.del(...albumKeys);
    }

    const deletedPhoto = await Album.findByIdAndDelete(album._id);

    return deletedPhoto;
  } catch (error) {
    throw error;
  }
};
