const db = require("../db/connection");

exports.fetchArticle = async (id) => {
  const result = await db.query(
    `select * from articles where article_id = $1`,
    [id]
  );

  return result.rows;
};
