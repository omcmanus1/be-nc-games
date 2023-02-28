const { removeSingleComment } = require("../controllers/comments-controllers");

const commentsRouter = require("express").Router();

commentsRouter.delete("/:comment_id", removeSingleComment);

module.exports = commentsRouter;
