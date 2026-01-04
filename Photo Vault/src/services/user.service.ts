import { RedisClient } from "../config/db.config";
import User from "../model/user.model";
import msgpack from "msgpack-lite";

export const getAllUsersService = async () => {
  const usersKey = `users:all`;
  try {
    const cachedUsers = await RedisClient.getBuffer(usersKey);
    if (cachedUsers) {
      return msgpack.decode(cachedUsers);
    }

    const users = await User.find().lean({
      transform: (doc: any) => {
        doc._id = doc._id.toString();
        return doc;
      },
    });
    const encoded = msgpack.encode(users);
    await RedisClient.setex(usersKey, 3600, encoded);
    return users;
  } catch (error) {
    throw error;
  }
};
