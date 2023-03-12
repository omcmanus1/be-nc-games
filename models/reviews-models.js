const db = require("../db/connection");
const format = require("pg-format");

const { selectCategories } = require("./categories-models");
const { checkForContent, promiseRejection } = require("../utils/error-utils");
const { checkNewReviewFormat } = require("../utils/models-utils");

exports.checkAvailableCategories = (queryCat) => {
  return selectCategories().then((categories) => {
    availableCategories = categories.map((category) => category.slug);
    if (queryCat && !availableCategories.includes(queryCat)) {
      return promiseRejection(404, "Category does not exist");
    }
    return queryCat;
  });
};

exports.selectReviews = (category, sort_by = "created_at", order = "desc") => {
  const queryParams = [];
  let queryString = `
    SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category,
    reviews.review_img_url, reviews.created_at, reviews.votes, 
    reviews.designer, COUNT(comments.comment_id) AS comment_count
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
    return checkForContent(reviews, "No reviews for this category");
  });
};

exports.selectSingleReview = (reviewId) => {
  const queryString = `
  SELECT reviews.review_id, reviews.title, reviews.review_body,
    reviews.designer, reviews.review_img_url, reviews.votes, 
    reviews.category, reviews.owner, reviews.created_at,
    COUNT(comments.comment_id) AS comment_count
  FROM reviews 
  LEFT JOIN comments
  ON reviews.review_id = comments.review_id
  WHERE reviews.review_id = $1
  GROUP BY reviews.review_id
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

exports.selectReviewById = (reviewId) => {
  const queryString = `SELECT * FROM reviews WHERE review_id = $1`;
  return db.query(queryString, [reviewId]).then((reviewCheck) => {
    return checkForContent(reviewCheck, "Review ID not found");
  });
};

exports.updateReviewData = (reviewId, increment) => {
  if (!increment) {
    return promiseRejection(400, "Invalid request format");
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
    return checkForContent(review, "Review ID not found");
  });
};

exports.selectReviewWithCommentCount = (reviewId) => {
  const queryString = `
  SELECT 
    reviews.*, COUNT(comments.comment_id)::INT AS comment_count 
  FROM reviews 
  LEFT JOIN comments
  ON reviews.review_id = comments.review_id
  WHERE reviews.review_id = $1
  GROUP BY reviews.review_id
  `;
  return db.query(queryString, [reviewId]).then((review) => {
    return review.rows;
  });
};

exports.insertSingleReview = (
  review,
  image_url = "https://media.tenor.com/x8v1oNUOmg4AAAAd/rickroll-roll.gif"
) => {
  if (typeof review.title === "number") {
    return promiseRejection(400, "Invalid input provided");
  }
  const queryString = `
  INSERT INTO reviews 
    (owner, title, review_body, designer, category, review_img_url)
  VALUES
    ($1, $2, $3, $4, $5, $6)
  RETURNING *
  `;
  const queryParams = [
    review.owner,
    review.title,
    review.review_body,
    review.designer,
    review.category,
    image_url,
  ];
  return db.query(queryString, queryParams).then((review) => {
    return this.selectReviewWithCommentCount(review.rows[0].review_id);
  });
};
