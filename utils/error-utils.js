exports.checkForContent = (queryOuput, message) => {
  if (queryOuput.rowCount > 0) {
    return queryOuput.rows;
  } else {
    return Promise.reject({
      status_code: 404,
      message: message,
    });
  }
};

exports.promiseRejection = (code, message) => {
  return Promise.reject({
    status_code: code,
    message: message,
  });
};
