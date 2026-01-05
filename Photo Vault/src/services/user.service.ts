import { RedisClient } from "../config/db.config";
import User from "../model/user.model";

export const getAllUsersService = async () => {
  const usersKey = `users:all`;
  try {
    const cachedUsers = await RedisClient.get(usersKey);
    if (cachedUsers) {
      return JSON.parse(cachedUsers);
    }

    const users = await User.find().lean({
      transform: (doc: any) => {
        doc._id = doc._id.toString();
        return doc;
      },
    });
    if (users.length > 0) {
      await RedisClient.setex(usersKey, 3600, JSON.stringify(users));
    }
    return users;
  } catch (error) {
    throw error;
  }
};
