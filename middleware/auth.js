const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const ms = require("ms");

const User = require("../models/users");
const { generateJWT } = require("../utils/auth");

const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRE,
  REFRESH_TOKEN_EXPIRE,
} = process.env;

const isAuthenticated = (req, res, next) => {
  try {
    let decodedToken;
    const authToken = req.get("Authorization");
    const accessToken = authToken?.split("Bearer ")[1];

    if (!accessToken) {
      const error = createError.Unauthorized();
      throw error;
    }

    const { signedCookies = {} } = req;

    const { refreshToken } = signedCookies;

    if (!refreshToken) {
      const error = createError.Unauthorized();
      throw error;
    }

    decodedToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);

    const { userId } = decodedToken;

    const user = User.findById(userId);

    if (!user) {
      const error = createError.Unauthorized();
      throw error;
    }

    req.userId = user.id;
    return next();
  } catch (error) {
    return next(error);
  }
};

const generateAuthToken = async (req, res, next) => {
  const { userId } = req;

  const RefreshToken = generateJWT(
    userId,
    REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRE
  );

  const AccessToken = generateJWT(
    userId,
    ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRE
  );

  const RefreshTokenExpirationTime = new Date(
    Date.now() + ms(REFRESH_TOKEN_EXPIRE)
  ).getTime();

  const user = await User.updateOne(userId, {
    refreshToken: RefreshToken,
    refreshTokenExpirationTime: RefreshTokenExpirationTime,
  });

  res.cookie("refreshToken", RefreshToken, {
    httpOnly: true,
    secure: !dev,
    signed: true,
    expires: new Date(Date.now() + ms(REFRESH_TOKEN_EXPIRE)),
  });

  const AccessTokenExpiresAt = new Date(Date.now() + ms(ACCESS_TOKEN_EXPIRE));

  res.status(200).json({
    user,
    token: AccessToken,
    AccessTokenExpiresAt,
  });
};

module.exports = {
  isAuthenticated,
  generateAuthToken,
};
