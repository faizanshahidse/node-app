/** @type {import("express").RequestHandler} */

const createError = require("http-errors");
const jwt = require("jsonwebtoken");

const User = require("../models/users");
const { clearTokens, generateJWT } = require("../utils/auth");

const signup = async (req, res, next) => {
  const { name, username, email, password } = req.body;

  console.log("body.............", req.body);

  if (!name || !username || !email || !password) {
    res.status(422).json({
      error: "Please provide all the required fields",
    });
  }

  try {
    const userAlreadyExist = await User.findOne({ email });

    console.log("userAlreadyExist........", userAlreadyExist);

    if (userAlreadyExist) {
      res.status(422).json({
        error: "Username or email is already exist",
      });
    }

    const newUserObj = {
      name,
      username,
      email,
      password,
    };

    const newUser = await User.create(newUserObj);
    req.userId = newUser.id;

    res.status(200).json({ message: "User is created successfully", newUser });
  } catch (error) {
    console.log(error);
  }
};

const login = (req, res, next) => {
  const { username, password } = req.body;

  try {
    if (!email || !password) {
      res.status(422).json({
        error: "Please fill all the required fields!",
      });
    }

    const user = User.findOne({ email });

    if (!user) {
      const error = createError.Unauthorized("Invalid username or password");
      throw error;
    }

    const passwordMatch = user.password == password;

    if (!passwordMatch) {
      const error = createError.Unauthorized("Invalid username or password");
      throw error;
    }

    req.userId = user.id;
  } catch (error) {
    return next(error);
  }
};

const refreshAccessToken = async (req, res, next) => {
  const { signedCookies } = req;
  const { refreshToken } = signedCookies;

  const { REFRESH_TOKEN_SECRET, ACCESS_TOKEN_EXPIRE, ACCESS_TOKEN_SECRET } =
    process.env;

  if (!refreshToken) {
    return res.sendStatus(204);
  }

  try {
    const refreshTokenInDB = await User.findOne({ refreshToken });

    if (!refreshTokenInDB) {
      await clearTokens(req, res, next);
      const error = createError.Unauthorized();
      throw error;
    }

    const decodedToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const { userId } = decodedToken;

    const user = await User.findById(userId);

    if (!user) {
      await clearTokens();
      const error = createError("Invalid credentials", 401);
      throw error;
    }

    const accessToken = generateJWT(
      user.id,
      ACCESS_TOKEN_SECRET,
      ACCESS_TOKEN_EXPIRE
    );

    res.status(200).json({
      user,
      token: accessToken,
      expiresAt: new Date(Date.now() + ms(ACCESS_TOKEN_EXPIRE)),
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  signup,
  login,
};
