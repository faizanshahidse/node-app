/** @type {import("express").RequestHandler} */

const signup = (req, res, next) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    res.status(422).json({
      error: "Please provide all the required fields",
    });
  }

  try {
  } catch (error) {}
};
