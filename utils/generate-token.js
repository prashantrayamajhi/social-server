const jwt = require("jsonwebtoken");

/**
 * Generates a token for user
 *
 * @param {object} user
 * @param {string} secret
 * @param {date} expiresIn
 */
exports.generateToken = (user, secret, expiresIn) => {
  const { _id, name, email } = user;

  return jwt.sign({ id: _id, name, email }, secret, { expiresIn });
};
