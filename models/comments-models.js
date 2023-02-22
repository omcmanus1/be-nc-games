const db = require("../db/connection");
const { checkIdExists } = require("./utils");

exports.insertSingleComment = (commentObj, reviewId) => {
  if (isNaN(Number(reviewId))) {
    return Promise.reject({
      status_code: 400,
      message: `Invalid review ID provided`,
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
