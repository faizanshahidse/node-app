const createError = require("http-errors");
const User = require("../models/users");

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      const error = createError.NotFound();
      throw error;
    }

    res.status(200).json({ data: user });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getUserById,
};
