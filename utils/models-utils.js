const { promiseRejection } = require("./error-utils");

exports.checkNewReviewFormat = (reviewObj) => {
  const requiredProperties = [
    "owner",
    "title",
    "review_body",
    "designer",
    "category",
    "review_img_url",
  ];
  return requiredProperties.every((prop) => reviewObj.hasOwnProperty(prop));
};

// const ex1 = new Set([1, 2, 3, 4, 5, 6]);
// const ex2 = new Set([1, 2, 3, 4, 5, 6]);

// console.log(ex1 == ex2);
