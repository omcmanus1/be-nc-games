const db = require("./db/connection");
const express = require("express");
const app = express();

const {
  nonExistentPath404,
  errorHandler500,
  errorHandler404,
  errorHandler400,
  customErrorHandler,
} = require("./controllers/error-handling-controllers");
const { getCategories } = require("./controllers/categories-controllers");
const {
  getReviews,
  getSingleReview,
  getReviewComments,
} = require("./controllers/reviews-controllers");

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getSingleReview);
app.get("/api/reviews/:review_id/comments", getReviewComments);

app.use(nonExistentPath404);

app.use(customErrorHandler);
app.use(errorHandler500);

module.exports = app;
