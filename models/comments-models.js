const db = require("../db/connection");
const { checkIdExists } = require("./utils");

exports.insertSingleComment = (commentObj, reviewId) => {
  if (isNaN(Number(reviewId))) {
    return Promise.reject({
      status_code: 400,
      message: `Invalid review ID provided`,
    });
  }
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
