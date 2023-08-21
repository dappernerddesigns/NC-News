const { fetchArticle } = require("../models/articles.models");

exports.getArticleById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    console.log(req.params);
    const article = await fetchArticle(article_id);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};
