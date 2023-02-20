const {
  selectReviews,
  selectSingleReview,
} = require("../models/reviews-models");

exports.getReviews = (req, res, next) => {
  selectReviews()
    .then((reviews) => res.status(200).send({ reviews }))
    .catch((err) => next(err));
};

exports.getSingleReview = (req, res, next) => {
  const { reviewId } = query.params;
  console.log(reviewId);
  selectSingleReview()
    .then((review) => res.status(200).send({ review }))
    .catch((err) => next(err));
};
