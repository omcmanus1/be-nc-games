const db = require("../db/connection");
const format = require("pg-format");

const { selectCategories } = require("./categories-models");

const getAvailableCategories = () => {
  return selectCategories()
    .then((categories) => {
      return categories.map((category) => category.slug);
    })
    .catch((err) => next(err));
};

exports.selectReviews = (category, sort_by = "created_at", order = "desc") => {
  const queryParams = [];
  let queryString = `
    SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category,
    reviews.review_img_url, reviews.created_at, reviews.votes, 
    reviews.designer, COUNT(comments.body) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id`;
  if (category) {
    queryString += `
    WHERE reviews.category = $1`;
    queryParams.push(category);
  }
  queryString += `
    GROUP BY reviews.review_id
    ORDER BY reviews.%s `;
  queryString += `%s`;
  const sql = format(queryString, sort_by, order);
  return db.query(sql, queryParams).then((reviews) => {
    if (reviews.rows.length === 0) {
      return Promise.reject({
        status_code: 404,
        message: "No reviews for this category",
      });
    }
    return reviews.rows;
  });
};

exports.selectSingleReview = (reviewId) => {
  const queryString = `
  SELECT reviews.review_id, reviews.title, reviews.review_body,
    reviews.designer, reviews.review_img_url, reviews.votes, 
    reviews.category, reviews.owner, reviews.created_at
  FROM reviews
  WHERE reviews.review_id = $1
  `;
  return db.query(queryString, [reviewId]).then((review) => {
    return review.rows;
  });
};

exports.selectReviewComments = (reviewId) => {
  const queryString = `
  SELECT comment_id, votes, created_at, author, body, review_id
  FROM comments
  WHERE review_id = $1
  `;
  return db.query(queryString, [reviewId]).then((comments) => {
    return comments.rows;
  });
};

exports.selectReviewId = (reviewId) => {
  const queryString = `SELECT * FROM reviews WHERE review_id = $1`;
  return db.query(queryString, [reviewId]).then((reviewCheck) => {
    if (reviewCheck.rowCount === 0) {
      return Promise.reject({
        status_code: 404,
        message: `Sorry, review ID not found`,
      });
    }
    return reviewCheck.rows;
  });
};

exports.updateReviewData = (reviewId, increment) => {
  if (!increment) {
    return Promise.reject({
      status_code: 400,
      message: `Invalid request format`,
    });
  }
  const queryString = `
  UPDATE reviews
  SET 
    votes = votes + $1
  WHERE review_id = $2
  RETURNING *
  `;
  const queryParams = [increment, reviewId];
  return db.query(queryString, queryParams).then((review) => {
    if (review.rowCount === 0) {
      return Promise.reject({
        status_code: 404,
        message: `Sorry, review ID not found`,
      });
    }
    return review.rows;
  });
};
