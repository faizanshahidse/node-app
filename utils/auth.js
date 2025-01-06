const jwt = require("jsonwebtoken");

const User = require("../models/users");

const generateJWT = (userId, secret, expirationTime) => {
  return jwt.sign({ userId }, secret, { expiresIn: expirationTime });
};

const clearTokens = async (req, res) => {
  const { signedCookies, userId } = req;
  const { refreshToken } = signedCookies;

  await User.updateOne({ userId }, { refreshToken: null });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: !dev,
    signed: true,
  });
};

module.exports = {
  generateJWT,
  clearTokens,
};
