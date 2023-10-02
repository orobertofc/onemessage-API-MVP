import client from "./connect.js";

export async function socketToRedis(
  userId: string,
  socketId: string,
): Promise<void> {
  try {
    await client.set(userId, socketId);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function socketFromRedis(userId: string): Promise<string> {
  try {
    return await client.get(userId);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteSocketFromRedis(userId: string): Promise<void> {
  try {
    await client.del(userId);
  } catch (error) {
    throw new Error(error.message);
  }
}
