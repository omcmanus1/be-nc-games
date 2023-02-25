const db = require("../db/connection");
const { checkIdExists } = require("../utils/utils");

exports.insertSingleComment = (commentObj, reviewId) => {
  const requiredProperties = ["username", "body"];
  if (!requiredProperties.every((prop) => commentObj.hasOwnProperty(prop))) {
    return Promise.reject({
      status_code: 400,
      message: `Invalid comment submitted`,
    });
  }
  const queryString = `
  INSERT INTO comments 
    (body, review_id, author)
  VALUES
    ($1, $2, $3)
  RETURNING *`;
  const queryParams = [commentObj.body, reviewId, commentObj.username];
  return db.query(queryString, queryParams).then((comment) => {
    checkIdExists(comment, "review");
    return comment.rows;
  });
};

exports.selectUser = (username) => {
  const queryString = "SELECT * FROM reviews WHERE owner = $1";
  return db.query(queryString, [username]).then((userCheck) => {
    if (userCheck.rowCount === 0) {
      return Promise.reject({
        status_code: 404,
        message: `Sorry, user ID not found`,
      });
    }
    return userCheck.rows;
  });
};

exports.deleteSingleComment = (commentId) => {
  const queryString = `DELETE FROM comments WHERE comment_id = $1`;
  return db.query(queryString, [commentId]);
};

exports.selectCommentById = (commentId) => {
  const queryString = `SELECT * FROM comments WHERE comment_id = $1`;
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
