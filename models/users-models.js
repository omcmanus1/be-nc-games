const db = require("../db/connection");
const { checkForContent } = require("../utils/error-utils");

exports.selectUsers = () => {
  const queryString = `SELECT * FROM users`;
  return db.query(queryString).then((users) => users.rows);
};

exports.selectUserByUsername = (username) => {
  const queryString = `
    SELECT * FROM USERS
    WHERE username = $1`;
  return db.query(queryString, [username]).then((user) => {
    return checkForContent(user, "Username not found");
  });
};
