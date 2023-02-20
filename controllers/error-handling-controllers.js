exports.errorHandler500 = (err, req, res, next) => {
  res.status(400).send({ msg: "Bad Request" });
};
