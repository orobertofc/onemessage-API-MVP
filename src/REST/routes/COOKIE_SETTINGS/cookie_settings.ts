/**
 * Generates cookie options object.
 *
 * @param {number|string} expireTime - The expiration time for the cookie in milliseconds.
 * @returns {Object} - The options object for the cookie.
 */

interface CookieOptions {
    expires: Date;
    httpOnly: boolean;
    secure: boolean;
    sameSite: any;
}



const getCookieOptions = (expireTime: string): CookieOptions => ({
    expires: new Date(Date.now() + Number(expireTime)),
    httpOnly: true,
    secure: true,
    sameSite: "strict"
})

export const authCookieOptions: CookieOptions = getCookieOptions(String(process.env.ACCESS_TOKEN_EXPIRATION));
export const refreshCookieOptions: CookieOptions = getCookieOptions(String(process.env.REFRESH_TOKEN_EXPIRATION));