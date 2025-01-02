const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

// const indexRouter = require("./routes/index");
// const usersRouter = require("./routes/users");

const app = express();

const { PORT, NODE_ENV } = process.env;

const isDev = NODE_ENV === "development";

if (isDev) {
  app.use(
    cors({
      origin: "http://localhost:3000",
      optionsSuccessStatus: 200,
      credentials: true,
    })
  );
}

app.get("/", (req, res) => {
  res.send("Home App...");
});

// view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// express.static middleware to serve the static files from the public directory.
app.use(express.static(path.join(__dirname, "public")));

// app.use("/", indexRouter);
// app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = isDev ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
