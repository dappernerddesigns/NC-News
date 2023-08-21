const db = require("../db/connection");

exports.fetchArticle = async (id) => {
  const { rows } = await db.query(
    `select * from articles where article_id = $1`,
    [id]
  );
  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Article not found" });
  } else {
    return rows;
  }
};
