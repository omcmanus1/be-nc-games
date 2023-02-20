const db = require("./db/connection");
const express = require("express");
const app = express();

const { errorHandler500 } = require("./controllers/error-handling-controllers");
const { getCategories } = require("./controllers/categories-controllers");
const { getReviews, getSingleReview } = require("./controllers/reviews-controllers");

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:id", getSingleReview)

app.use(errorHandler500);

module.exports = app;
