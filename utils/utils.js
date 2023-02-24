exports.idNumberChecker = (id, idType) => {
  if (isNaN(Number(id))) {
    return Promise.reject({
      status_code: 400,
      message: `Invalid ${idType} ID provided`,
    });
  }
};

exports.checkIdExists = (queryOuput, idType) => {
  if (queryOuput.rowCount === 0) {
    return Promise.reject({
      status_code: 404,
      message: `Sorry, ${idType} ID not found`,
    });
  }
};
