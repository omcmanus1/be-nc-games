const {
  selectReviews,
  selectSingleReview,
  selectReviewComments,
} = require("../models/reviews-models");

exports.getReviews = (req, res, next) => {
  selectReviews()
    .then((reviews) => res.status(200).send({ reviews }))
    .catch((err) => next(err));
};

exports.getSingleReview = (req, res, next) => {
  const { review_id } = req.params;
  selectSingleReview(review_id)
    .then((review) => {
      if (review.length === 0) {
        return Promise.reject({ status_code: 404, msg: "ID not found" });
      }
      return res.status(200).send({ review });
    })
    .catch((err) => next(err));
};

exports.getReviewComments = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewComments(review_id)
    .then((comments) => res.status(200).send({ comments }))
    .catch((err) => next(err));
};
