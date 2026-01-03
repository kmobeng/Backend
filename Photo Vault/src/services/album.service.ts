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
  const userKey = `username:${userId}:${username}`;
  const albumsKey = `album:${userId}:${username}`;
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
        throw createError("Error fetching albums", 400);
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
  userId: string
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

    const album = await Album.findOne({ _id: albumId });

    if (album !== null) {
      RedisClient.setex(albumKey, 3600, JSON.stringify(album));
    }
    return album;
  } catch (error) {
    throw error;
  }
};
