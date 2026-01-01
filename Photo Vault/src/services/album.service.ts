import { RedisClient } from "../config/db.config";
import Album from "../model/album.model";
import { createError } from "../utils/error.util";
import User from "../model/user.model";

export const createAlbumService = async (
  name: string,
  userId: string,
  username: string
) => {
  const albumKey = `albumm:${userId}`;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      throw createError("No user found", 400);
    }
    if (user._id.toString() !== userId) {
      throw createError("Error occured when creating photo", 400);
    }
    const album = await Album.create({ name, user: userId });
    if (!album) {
      throw createError("Unable to create album", 400);
    }
    return album;
  } catch (error) {
    throw error;
  }
};

export const getAllAlbumsService = async (username: string) => {
  const userKey = `username:${username}`;
  try {
    let user;
    const cachedUser = await RedisClient.get(userKey);
    if (cachedUser) {
      user = JSON.parse(cachedUser);
    } else {
      user = await User.findOne({ username });
      if (user) {
        await RedisClient.set(userKey, JSON.stringify(user));
      }
    }

    if (!user) {
      throw createError("User not found", 400);
    }
    console.log(user);
    const albums = await Album.find({ user: user?._id });

    return albums;
  } catch (error) {
    throw error;
  }
};
