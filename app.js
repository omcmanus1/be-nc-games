const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const usersRouter = require("./routes/users-router");
const categoriesRouter = require("./routes/categories-router");

const {
  nonExistentPath404,
  errorHandler500,
  customErrorHandler,
} = require("./controllers/error-handling-controllers");
const {
  getReviews,
  getSingleReview,
  getReviewComments,
  patchSingleReview,
} = require("./controllers/reviews-controllers");
const {
  postSingleComment,
  removeSingleComment,
} = require("./controllers/comments-controllers");

app.use(express.json());

app.use("/api", apiRouter);
app.use("/api/users", usersRouter);
app.use("/api/categories", categoriesRouter);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getSingleReview);
app.get("/api/reviews/:review_id/comments", getReviewComments);

app.post("/api/reviews/:review_id/comments", postSingleComment);
app.patch("/api/reviews/:review_id", patchSingleReview);
app.delete("/api/comments/:comment_id", removeSingleComment);

app.use(nonExistentPath404);

app.use(customErrorHandler);
app.use(errorHandler500);

module.exports = app;
