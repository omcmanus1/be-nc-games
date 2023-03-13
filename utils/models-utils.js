const { promiseRejection } = require("./error-utils");

exports.checkNewReviewFormat = (reviewObj) => {
  console.log(reviewObj);
  if (!reviewObj) {
    return promiseRejection(400, "No review provided");
  }
  const requiredProperties = [
    "owner",
    "title",
    "review_body",
    "designer",
    "category",
    "review_img_url",
  ];
  if (!requiredProperties.every((prop) => reviewObj.hasOwnProperty(prop))) {
    return promiseRejection(400, "Invalid review format");
  }
};
