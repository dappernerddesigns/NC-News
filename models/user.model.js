const db = require("../db/connection");

exports.fetchUsers = async () => {
  const { rows } = await db.query(`select * from users`);
  return rows;
};
