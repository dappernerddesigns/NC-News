const articlesRouter = require("express").Router();
const {
  getArticleById,
  getAllArticles,
  getCommentsById,
  postCommentById,
} = require("../controllers/articles.controller");

articlesRouter.route("/:article_id").get(getArticleById);
articlesRouter.route("/").get(getAllArticles);
articlesRouter.route("/:article_id/comments").get(getCommentsById);
articlesRouter.route("/:article_id/comments").post(postCommentById);
module.exports = { articlesRouter };
