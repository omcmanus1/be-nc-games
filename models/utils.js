exports.idNumberChecker = (id) => {
  if (isNaN(Number(id))) {
    return Promise.reject({ status_code: 400, msg: "Invalid ID provided" });
  }
};
