const {
  insertSingleComment,
  selectUser,
  deleteSingleComment,
} = require("../models/comments-models");
const { selectReviewById } = require("../models/reviews-models");
const { checkForContent } = require("../utils/error-utils");

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

exports.removeSingleComment = (req, res, next) => {
  const { comment_id } = req.params;
  deleteSingleComment(comment_id)
    .then((output) => {
      return checkForContent(output, "Comment ID not found");
    })
    .then(() => res.status(204).send())
    .catch((err) => next(err));
};
