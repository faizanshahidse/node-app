/** @type {import("mongoose")} */

const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    require: [true, "Your name is required"],
  },
  username: {
    type: String,
    require: [true, "username is required"],
  },
  email: {
    type: String,
    require: [true, "Your email is required"],
  },
  password: {
    type: String,
    require: [true, "password is required"],
  },
});

module.exports = model("User", userSchema);

// module.exports = user;
