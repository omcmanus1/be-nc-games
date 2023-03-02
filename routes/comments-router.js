const {
  removeSingleComment,
  patchSingleComment,
} = require("../controllers/comments-controllers");

const commentsRouter = require("express").Router();

commentsRouter.patch("/:comment_id", patchSingleComment);
commentsRouter.delete("/:comment_id", removeSingleComment);

module.exports = commentsRouter;
