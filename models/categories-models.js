const db = require("../db/connection");

exports.selectCategories = () => {
  let queryString = `SELECT * FROM categories`;
  return db.query(queryString).then((categories) => categories.rows);
};
