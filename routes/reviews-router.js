const { postSingleComment } = require("../controllers/comments-controllers");
const {
  getReviews,
  getSingleReview,
  getReviewComments,
  patchSingleReview,
} = require("../controllers/reviews-controllers");

const reviewsRouter = require("express").Router();

reviewsRouter.get("/", getReviews);
reviewsRouter.get("/:review_id", getSingleReview);
reviewsRouter.get("/:review_id/comments", getReviewComments);

reviewsRouter.post("/:review_id/comments", postSingleComment);
reviewsRouter.patch("/:review_id/", patchSingleReview);

module.exports = reviewsRouter;
