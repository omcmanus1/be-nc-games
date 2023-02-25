const {
  insertSingleComment,
  selectUser,
  deleteSingleComment,
} = require("../models/comments-models");
const { selectReviewId } = require("../models/reviews-models");

exports.postSingleComment = (req, res, next) => {
  const commentObj = req.body;
  const { review_id } = req.params;
  const checkReviewIdPromise = selectReviewId(review_id);
  const checkUserPromise = selectUser(commentObj.username);
  const insertCommentPromise = insertSingleComment(commentObj, review_id);
  Promise.all([checkReviewIdPromise, checkUserPromise, insertCommentPromise])
    .then((comment) => {
      res.status(201).send({ comment: comment[2] });
    })
    .catch((err) => next(err));
};

exports.removeSingleComment = (req, res, next) => {
  const { comment_id } = req.params;
  deleteSingleComment(comment_id).then((deletion) => {
    res.status(204).send();
  });
};
