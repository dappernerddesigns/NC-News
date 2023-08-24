const db = require("../db/connection");

exports.removeComment = async (id) => {
  const { rows } = await db.query(
    `delete from comments where comment_id = $1 returning *`,
    [id]
  );
  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Comment not found" });
  }
};
