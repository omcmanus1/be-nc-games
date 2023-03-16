const db = require("../db/connection");
const { checkForContent, promiseRejection } = require("../utils/error-utils");

exports.insertSingleComment = (commentObj, reviewId) => {
  const requiredProperties = ["username", "body"];
  if (!requiredProperties.every((prop) => commentObj.hasOwnProperty(prop))) {
    return promiseRejection(400, "Invalid comment submitted");
  }
  if (!commentObj.body) {
    return promiseRejection(400, "No comment provided");
  }
  const queryString = `
  INSERT INTO comments 
    (body, review_id, author)
  VALUES
    ($1, $2, $3)
  RETURNING *`;
  const queryParams = [commentObj.body, reviewId, commentObj.username];
  return db.query(queryString, queryParams).then((comment) => {
    return checkForContent(comment, "Review ID does not exist");
  });
};

exports.selectUser = (username) => {
  const queryString = "SELECT * FROM reviews WHERE owner = $1";
  return db.query(queryString, [username]).then((userCheck) => {
    return checkForContent(userCheck, "User ID not found");
  });
};

exports.selectCommentById = (commentId) => {
  const queryString = `SELECT * FROM comments WHERE comment_id = $1`;
  return db.query(queryString, [commentId]).then((reviewCheck) => {
    return checkForContent(reviewCheck, "Review ID not found");
  });
};

exports.updateCommentData = (commentId, incVotes) => {
  if (!incVotes) {
    return promiseRejection(400, "Invalid request format");
  }
  const queryString = `
  UPDATE comments
  SET votes = votes + $1
  WHERE comment_id = $2
  RETURNING *
  `;
  const queryParams = [incVotes, commentId];
  return db.query(queryString, queryParams).then((comment) => {
    return checkForContent(comment, "Comment ID not found");
  });
};

exports.deleteSingleComment = (commentId) => {
  const queryString = `DELETE FROM comments WHERE comment_id = $1`;
  return db.query(queryString, [commentId]).then((comment) => {
    return checkForContent(comment, "Comment ID not found");
  });
};
