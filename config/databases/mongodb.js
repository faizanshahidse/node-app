const mongoose = require("mongoose");

const Connection = () => {
  try {
    const { MONGO_DB, MONGO_USER, MONGO_PWD } = process.env;

    const connectionString = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@cluster0.elmqreh.mongodb.net/${MONGO_DB}`;

    mongoose.connection.on("connected", () => console.log("connected"));
    mongoose.connection.on("open", () => console.log("open"));
    mongoose.connection.on("disconnected", () => console.log("disconnected"));
    mongoose.connection.on("reconnected", () => console.log("reconnected"));
    mongoose.connection.on("disconnecting", () => console.log("disconnecting"));
    mongoose.connection.on("close", () => console.log("close"));

    mongoose.connect(connectionString);
  } catch (error) {
    console.log(error);
  }
};

module.exports = Connection();
