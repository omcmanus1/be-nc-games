const db = require("../db/connection");

exports.insertSingleComment = (commentObj, reviewId) => {
  const queryString = `
  INSERT INTO comments 
    (body, review_id, author)
  VALUES
    ($1, $2, $3)
  RETURNING *`;
  const queryParams = [commentObj.body, reviewId, commentObj.username];
  return db.query(queryString, queryParams).then((comment) => comment.rows);
};
