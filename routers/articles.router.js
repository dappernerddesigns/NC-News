const articlesRouter = require("express").Router();
const {
  getArticleById,
  getAllArticles,
  getCommentsById,
} = require("../controllers/articles.controller");

articlesRouter.route("/:article_id").get(getArticleById);
articlesRouter.route("/").get(getAllArticles);
articlesRouter.route("/:article_id/comments").get(getCommentsById);
module.exports = { articlesRouter };
