const {
  insertSingleComment,
  selectUser,
  deleteSingleComment,
  updateCommentData,
} = require("../models/comments-models");
const { selectReviewById } = require("../models/reviews-models");

exports.postSingleComment = (req, res, next) => {
  const commentObj = req.body;
  const { review_id } = req.params;
  const checkReviewIdPromise = selectReviewById(review_id);
  const checkUserPromise = selectUser(commentObj.username);
  const insertCommentPromise = insertSingleComment(commentObj, review_id);
  Promise.all([checkReviewIdPromise, checkUserPromise, insertCommentPromise])
    .then((comment) => res.status(201).send({ comment: comment[2] }))
    .catch((err) => next(err));
};

exports.patchSingleComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateCommentData(comment_id, inc_votes)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => next(err));
};

exports.removeSingleComment = (req, res, next) => {
  const { comment_id } = req.params;
  deleteSingleComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => next(err));
};
