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
  const { id } = req.params;
  selectSingleReview(id)
    .then((review) => {
      if (review.rows.length === 0) {
        return Promise.reject("ID not found");
      }
      return res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};
