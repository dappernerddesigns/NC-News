const {
  fetchArticle,
  fetchAllArticles,
  fetchCommentsById,
} = require("../models/articles.models");

exports.getArticleById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const article = await fetchArticle(article_id);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.getAllArticles = async (req, res, next) => {
  try {
    const articles = await fetchAllArticles();
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};

exports.getCommentsById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const comments = await fetchCommentsById(article_id);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};
