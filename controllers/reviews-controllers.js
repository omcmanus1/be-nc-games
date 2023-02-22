const {
  selectReviews,
  selectSingleReview,
  selectReviewComments,
  selectReviewId,
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
  const checkReviewIdExists = selectReviewId(review_id);
  const fetchRelevantComments = selectReviewComments(review_id);
  Promise.all([checkReviewIdExists, fetchRelevantComments])
    .then((comments) => {
      res.status(200).send({ comments: comments[1] });
    })
    .catch((err) => next(err));
};
