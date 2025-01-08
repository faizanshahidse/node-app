const jwt = require("jsonwebtoken");

const User = require("../models/users");

const generateJWT = (userId, secret, expirationTime) => {
  return jwt.sign({ userId }, secret, { expiresIn: expirationTime });
};

const clearTokens = async (req, res, next) => {
  const { signedCookies, userId } = req;
  const { refreshToken } = signedCookies;

  const dev = process.env.NODE_ENV === "development";

  const userUpdated = await User.updateOne(
    { refreshToken },
    { refreshToken: null }
  );

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: !dev,
    signed: true,
  });
  return next();
};

module.exports = {
  generateJWT,
  clearTokens,
};
