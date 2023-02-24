const {
  selectReviews,
  selectSingleReview,
  selectReviewComments,
  selectReviewId,
  updateReviewData,
  checkAvailableCategories,
} = require("../models/reviews-models");

exports.getReviews = (req, res, next) => {
  let { category, sort_by, order } = req.query;
  checkAvailableCategories(category)
    .then((category) => {
      selectReviews(category, sort_by, order)
        .then((reviews) => res.status(200).send({ reviews }))
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

exports.getSingleReview = (req, res, next) => {
  const { review_id } = req.params;
  selectSingleReview(review_id)
    .then((review) => {
      if (review.length === 0) {
        return Promise.reject({
          status_code: 404,
          message: "Review ID not found",
        });
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

exports.patchSingleReview = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  updateReviewData(review_id, inc_votes)
    .then((review) => res.status(200).send({ review }))
    .catch((err) => next(err));
};
