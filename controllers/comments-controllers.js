const { insertSingleComment } = require("../models/comments-models");
const { selectReviewId } = require("../models/reviews-models");

exports.postSingleComment = (req, res, next) => {
  const commentObj = req.body;
  const { review_id } = req.params;
  const checkReviewIdPromise = selectReviewId(review_id);
  const insertCommentPromise = insertSingleComment(commentObj, review_id);
  Promise.all([checkReviewIdPromise, insertCommentPromise])
    .then((comment) => {
      res.status(201).send({ comment: comment[1] });
    })
    .catch((err) => next(err));
};
