const db = require("../db/connection");

exports.selectReviews = () => {
  const queryString = `
  SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category,
    reviews.review_img_url, reviews.created_at, reviews.votes, 
    reviews.designer, COUNT(comments.body) AS comment_count
  FROM reviews
  LEFT JOIN comments
  ON reviews.review_id = comments.review_id
  GROUP BY reviews.review_id
  ORDER BY reviews.created_at DESC
  `;
  return db.query(queryString).then((reviews) => reviews.rows);
};

exports.selectSingleReview = (reviewId) => {
  if (isNaN(Number(reviewId))) {
    return Promise.reject("Invalid ID provided");
  }
  const queryString = `
  SELECT reviews.review_id, reviews.title, reviews.review_body,
    reviews.designer, reviews.review_img_url, reviews.votes, 
    reviews.category, reviews.owner, reviews.created_at
  FROM reviews
  WHERE reviews.review_id = $1
  `;
  return db
    .query(queryString, [reviewId])
    .then((review) => review.rows)
    .catch((err) => next(err));
};
