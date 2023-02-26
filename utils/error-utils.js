exports.idNumberChecker = (id, idType) => {
  if (isNaN(Number(id))) {
    return Promise.reject({
      status_code: 400,
      message: `Invalid ${idType} ID provided`,
    });
  }
};

exports.checkforContent = (queryOuput, message) => {
  if (queryOuput.rowCount > 0) {
    return queryOuput.rows;
  } else {
    return Promise.reject({
      status_code: 404,
      message: message,
    });
  }
};
