/**
 * Generates cookie options object.
 *
 * @param {number|string} expireTime - The expiration time for the cookie in milliseconds.
 * @returns {Object} - The options object for the cookie.
 */
const getCookieOptions = (expireTime) => ({
    expires: new Date(Date.now() + Number(expireTime)),
    httpOnly: true,
    secure: true
})

module.exports = {
    authCookieOptions: getCookieOptions(process.env.ACCESS_TOKEN_EXPIRATION),
    refreshCookieOptions: getCookieOptions(process.env.REFRESH_TOKEN_EXPIRATION)
}