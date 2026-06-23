const jwt = require("jsonwebtoken");

/**
 * Signs a JWT for a given user id.
 * @param {string} id - Mongo ObjectId of the user
 * @param {boolean} remember - if true, issues a long-lived token ("Remember me")
 */
function generateToken(id, remember = false) {
  const expiresIn = remember
    ? process.env.JWT_REMEMBER_EXPIRE || "30d"
    : process.env.JWT_EXPIRE || "1d";

  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn });
}

module.exports = generateToken;
