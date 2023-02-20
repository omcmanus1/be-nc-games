const db = require("../db/connection");

exports.selectReviews = () => {
  const queryString = `
  SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category,
    reviews.review_img_url, reviews.created_at, reviews.votes, 
    reviews.designer, COUNT(comments.body) AS comment_count
  FROM reviews
  INNER JOIN comments
  ON reviews.review_id = comments.review_id
  GROUP BY reviews.review_id
  ORDER BY reviews.created_at
  `;
  return db.query(queryString).then((reviews) => reviews.rows);
};
