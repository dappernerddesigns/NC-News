const db = require("../db/connection");
const { checkExists } = require("../db/seeds/utils");

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

exports.fetchAllArticles = async () => {
  const { rows } = await db.query(
    `select a.article_id, a.title, a.topic, a.author, a.created_at, a.votes, a.article_img_url, count(c.comment_id)::int as comment_count from articles a
    left join comments c on a.article_id = c.article_id group by a.article_id order by a.created_at desc`
  );

  return rows;
};

exports.fetchCommentsById = async (id) => {
  const queryStr = `select * from comments where article_id = $1 order by created_at desc`;
  const [_, { rows }] = await Promise.all([
    checkExists("articles", "article_id", id),
    db.query(queryStr, [id]),
  ]);
  return rows;
};
