const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const usersRouter = require("./routes/users-router");
const categoriesRouter = require("./routes/categories-router");
const reviewsRouter = require("./routes/reviews-router");

const {
  nonExistentPath404,
  errorHandler500,
  customErrorHandler,
} = require("./controllers/error-handling-controllers");

const {
  postSingleComment,
  removeSingleComment,
} = require("./controllers/comments-controllers");

app.use(express.json());

app.use("/api", apiRouter);
app.use("/api/users", usersRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/reviews", reviewsRouter);

app.delete("/api/comments/:comment_id", removeSingleComment);

app.use(nonExistentPath404);
app.use(customErrorHandler);
app.use(errorHandler500);

module.exports = app;
