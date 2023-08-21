const articlesRouter = require("express").Router();
const {
  getArticleById,
  getAllArticles,
} = require("../controllers/articles.controller");

articlesRouter.route("/:article_id").get(getArticleById);
articlesRouter.route("/").get(getAllArticles);
module.exports = { articlesRouter };
