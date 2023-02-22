const { insertSingleComment } = require("../models/comments-models");

exports.postSingleComment = (req, res, next) => {
  const commentObj = req.body;
  const { review_id } = req.params;
  insertSingleComment(commentObj, review_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => next(err));
};
