const express = require("express");
const app = express();

const {
  nonExistentPath404,
  errorHandler500,
  customErrorHandler,
} = require("./controllers/error-handling-controllers");
const { getEndpoints } = require("./controllers/endpoints-controllers");
const { getCategories } = require("./controllers/categories-controllers");
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
const { getUsers } = require("./controllers/users-controllers");

app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/users", getUsers);
app.get("/api/categories", getCategories);
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
