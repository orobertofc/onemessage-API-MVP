import userFromDb from "./get_user_from_db.js";
import createToken from "../../../JWT/create_token.js";

/**
 * Logs in a user with the given username and password.
 *
 * @param {string} userName - The username of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<Array>} - A promise that resolves with an array
 * containing the access token, refresh token, and user ID upon successful
 * login. Throws an error if the username or password is invalid.
 */
async function loginUser(
  userName: string,
  password: string,
): Promise<[string, string, string]> {
  try {
    const user = await userFromDb(userName);

    if (user.password !== password) {
      throw new Error("Invalid password");
    }

    const [accessToken, refreshToken] = await createToken(user);

    return [accessToken, refreshToken, user.id];
  } catch (error) {
    throw new Error(error.message);
  }
}

export default loginUser;
