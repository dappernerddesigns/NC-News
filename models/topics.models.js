const db = require("../db/connection");

exports.fetchTopics = async () => {
  const result = await db.query(`select * from topics`);
  return result.rows;
};
