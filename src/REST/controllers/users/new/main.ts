import {v4 as uuidv4} from "uuid";
import saveUserToDb from "./insert_user_in_db.js";
import createToken from "../../../JWT/create_token.js";
/**
 * Creates a new user with the given name.
 *
 * @param {string} userName - The name of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<Array>} - A Promise that resolves to an array containing the access token,
 *                           refresh token, and user ID.
 * @throws {Error} - If an error occurs while creating the new user.
 */
async function newUser(userName: string, password: string): Promise<any[]> {
  try {
    const id = uuidv4();

    const user = {
      name: userName,
      id,
    };

    const [, [accessToken, refreshToken]] = await Promise.all([
      saveUserToDb(user, password),
      createToken(user),
    ])

    return [accessToken, refreshToken, id];

  } catch (error) {
    throw new Error(error.message);
  }
}

export default newUser;