import Album from "../model/album.model";
import { createError } from "../utils/error.util";

export const createAlbumService = async (name: string, user: string) => {
  try {
    const album = await Album.create({ name, user });
    if (!album) {
      throw createError("Unable to create album", 400);
    }
    return album;
  } catch (error) {
    throw error;
  }
};
