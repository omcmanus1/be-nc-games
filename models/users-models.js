const db = require("../db/connection");

exports.selectUsers = () => {
  const queryString = `SELECT * FROM users`;
  return db.query(queryString).then((users) => users.rows);
};
