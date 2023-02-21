const db = require("../db/connection");

exports.selectCategories = () => {
  const queryString = `SELECT * FROM categories`;
  return db.query(queryString).then((categories) => categories);
};
