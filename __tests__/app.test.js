const db = require("../db/connection");
const app = require("../app");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const {
  categoryData,
  commentData,
  reviewData,
  userData,
} = require("../db/data/test-data");
const endpoints = require("../utils/endpoints.json");

beforeEach(() => seed({ categoryData, commentData, reviewData, userData }));
afterAll(() => db.end());

describe("Generic Error Handling", () => {
  test("should respond with 404 code if incorrect endpoint is specified", () => {
    return request(app)
      .get("/api/categorieeeees")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Path Not Found");
      });
  });
});

describe("GET: /api", () => {
  test("should respond with 200 code and a JSON object with documentation for all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(endpoints);
      });
  });
});

describe("GET: /api/users", () => {
  test("should respond with 200 code and expected users object", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((users) => {
        const usersObj = users.body;
        expect(usersObj).toBeInstanceOf(Object);
        expect(usersObj.users.length).toBe(userData.length);
        const expectedOutput = {
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String),
        };
        usersObj.users.forEach((user) =>
          expect(user).toMatchObject(expectedOutput)
        );
      });
  });
});

describe("GET: /api/users/:username", () => {
  test("should respond with 200 code and expected user object", () => {
    return request(app)
      .get("/api/users/dav3rid")
      .expect(200)
      .then((user) => {
        const userOutput = user.body;
        expect(userOutput).toBeInstanceOf(Object);
        expect(userOutput.user.length).toBe(1);
        expect(userOutput.user[0]).toMatchObject({
          username: "dav3rid",
          name: expect.any(String),
          avatar_url: expect.any(String),
        });
      });
  });
  test("should respond with 404 code if passed a non-existent userame", () => {
    return request(app).get("/api/users/hmoleman8008").expect(404);
  });
});

describe("GET: /api/categories", () => {
  test("should respond with 200 code and correctly formatted objects array", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(body).toBeInstanceOf(Object);
        expect(categories).toBeInstanceOf(Array);
        expect(categories.length).toBe(categoryData.length);
        categories.forEach((category) => {
          expect(category).toHaveProperty("slug");
          expect(category).toHaveProperty("description");
        });
      });
  });
});

describe("GET: /api/reviews", () => {
  const reviewOutput = {
    owner: expect.any(String),
    title: expect.any(String),
    review_id: expect.any(Number),
    category: expect.any(String),
    review_img_url: expect.any(String),
    created_at: expect.any(String),
    votes: expect.any(Number),
    designer: expect.any(String),
    comment_count: expect.any(String),
  };
  test("should respond with 200 code and correctly formatted/sorted objects array", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        const { reviews } = body;
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews.length).toBe(reviewData.length);
        reviews.forEach((review) => {
          expect(review).toMatchObject(reviewOutput);
        });
        expect(reviews).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("should respond with an expected category object when 'category' is specified", () => {
    return request(app)
      .get("/api/reviews?category=social+deduction")
      .expect(200)
      .then((reviews) => {
        const reviewObj = reviews.body;
        expect(reviewObj).toBeInstanceOf(Object);
        expect(reviewObj.reviews.length).toBe(11);
        reviewObj.reviews.forEach((review) => {
          expect(review).toMatchObject(reviewOutput);
          expect(review.category).toBe("social deduction");
        });
        expect(reviewObj.reviews).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("should respond with a correctly sorted object when 'sort_by' is specified", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes")
      .expect(200)
      .then((reviews) => {
        const reviewObj = reviews.body;
        expect(reviewObj).toBeInstanceOf(Object);
        reviewObj.reviews.forEach((review) => {
          expect(review).toMatchObject(reviewOutput);
        });
        expect(reviewObj.reviews).toBeSortedBy("votes", {
          descending: true,
        });
      });
  });
  test("should respond with an object sorted by date ascending when 'order' is specified", () => {
    return request(app)
      .get("/api/reviews?order=asc")
      .expect(200)
      .then((reviews) => {
        const reviewObj = reviews.body;
        expect(reviewObj).toBeInstanceOf(Object);
        reviewObj.reviews.forEach((review) => {
          expect(review).toMatchObject(reviewOutput);
        });
        expect(reviewObj.reviews).toBeSortedBy("created_at", {
          ascending: true,
        });
      });
  });
  test("should respond with the correct output when 'category' & 'sort_by' are specified", () => {
    return request(app)
      .get("/api/reviews?category=dexterity&sort_by=votes")
      .expect(200)
      .then((reviews) => {
        const reviewObj = reviews.body;
        expect(reviewObj).toBeInstanceOf(Object);
        reviewObj.reviews.forEach((review) => {
          expect(review).toMatchObject(reviewOutput);
          expect(review.category).toBe("dexterity");
        });
        expect(reviewObj.reviews).toBeSortedBy("votes", {
          descending: true,
        });
      });
  });
  test("should respond with correct output when 'category' & 'order' are specified", () => {
    return request(app)
      .get("/api/reviews?category=dexterity&order=asc")
      .expect(200)
      .then((reviews) => {
        const reviewObj = reviews.body;
        expect(reviewObj).toBeInstanceOf(Object);
        reviewObj.reviews.forEach((review) => {
          expect(review).toMatchObject(reviewOutput);
          expect(review.category).toBe("dexterity");
        });
        expect(reviewObj.reviews).toBeSortedBy("created_at", {
          ascending: true,
        });
      });
  });
  test("should respond with correct output when 'sort_by' & 'order' are specified", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes&order=asc")
      .expect(200)
      .then((reviews) => {
        const reviewObj = reviews.body;
        expect(reviewObj).toBeInstanceOf(Object);
        reviewObj.reviews.forEach((review) => {
          expect(review).toMatchObject(reviewOutput);
        });
        expect(reviewObj.reviews).toBeSortedBy("votes", {
          ascending: true,
        });
      });
  });
  test("should respond with correct output when all 3 queries are specified", () => {
    return request(app)
      .get("/api/reviews?category=dexterity&sort_by=review_id&order=desc")
      .expect(200)
      .then((reviews) => {
        const reviewObj = reviews.body;
        expect(reviewObj).toBeInstanceOf(Object);
        reviewObj.reviews.forEach((review) => {
          expect(review).toMatchObject(reviewOutput);
          expect(review.category).toBe("dexterity");
        });
        expect(reviewObj.reviews).toBeSortedBy("review_id", {
          descending: true,
        });
      });
  });
  test("should respond with 404 code if category has no reviews associated", () => {
    return request(app)
      .get("/api/reviews?category=children's+games")
      .expect(404)
      .then((err) => {
        expect(err.body.message).toBe("No reviews for this category");
      });
  });
  test("should respond with 404 code if queried with invalid 'category' field", () => {
    return request(app)
      .get("/api/reviews?category=mushrooms")
      .expect(404)
      .then((err) => {
        expect(err.body.message).toBe("Category does not exist");
      });
  });
  test("should respond with 400 code if queried with invalid 'order'", () => {
    return request(app)
      .get("/api/reviews?order=sideways")
      .expect(400)
      .then((reviews) => {
        expect(reviews.body.message).toBe("Invalid input provided");
      });
  });
  test("should respond with 400 code if queried with invalid 'sort_by' field", () => {
    return request(app)
      .get("/api/reviews?sort_by=pencils")
      .expect(400)
      .then((reviews) => {
        expect(reviews.body.message).toBe("Invalid input provided");
      });
  });
});

describe("POST: /api/reviews", () => {
  test("should respond with 201 code and added review object", () => {
    return request(app)
      .post("/api/reviews")
      .send({
        owner: "bainesface",
        title: "Agricola: It's alright",
        review_body: "Not bad.",
        designer: "Uwe Rosenberg",
        category: "euro game",
        review_img_url:
          "https://media.tenor.com/x8v1oNUOmg4AAAAd/rickroll-roll.gif",
      })
      .expect(201)
      .then((review) => {
        const reviewObj = review.body;
        expect(reviewObj).toBeInstanceOf(Object);
        expect(reviewObj.review.length).toBe(1);
        const expectedOutput = {
          owner: "bainesface",
          title: "Agricola: It's alright",
          review_body: "Not bad.",
          designer: "Uwe Rosenberg",
          category: "euro game",
          review_img_url:
            "https://media.tenor.com/x8v1oNUOmg4AAAAd/rickroll-roll.gif",
          review_id: 14,
          votes: 0,
          created_at: expect.any(String),
          comment_count: 0,
        };
        expect(reviewObj.review[0]).toMatchObject(expectedOutput);
      });
  });
  test("should respond with 201 code and correct review object if body has more properties than necessary", () => {
    return request(app)
      .post("/api/reviews")
      .send({
        owner: "bainesface",
        hair_colour: "brown",
        real: false,
        title: "Agricola: It's alright",
        review_body: "Not bad.",
        designer: "Uwe Rosenberg",
        category: "euro game",
        review_img_url:
          "https://media.tenor.com/x8v1oNUOmg4AAAAd/rickroll-roll.gif",
      })
      .expect(201)
      .then((review) => {
        const reviewObj = review.body;
        expect(reviewObj).toBeInstanceOf(Object);
        expect(reviewObj.review.length).toBe(1);
        const expectedOutput = {
          owner: "bainesface",
          title: "Agricola: It's alright",
          review_body: "Not bad.",
          designer: "Uwe Rosenberg",
          category: "euro game",
          review_img_url:
            "https://media.tenor.com/x8v1oNUOmg4AAAAd/rickroll-roll.gif",
          review_id: 14,
          votes: 0,
          created_at: expect.any(String),
          comment_count: 0,
        };
        expect(reviewObj.review[0]).toMatchObject(expectedOutput);
      });
  });
  test("should return 400 if body has less properties than necessary", () => {
    return request(app)
      .post("/api/reviews")
      .send({
        title: "Agricola: It's alright",
        review_body: "Not bad.",
        category: "euro game",
        review_img_url:
          "https://media.tenor.com/x8v1oNUOmg4AAAAd/rickroll-roll.gif",
      })
      .expect(400)
      .then((err) => {
        expect(err.body.message).toEqual("Invalid input provided");
      });
  });
  test("should return 400 if no body is provided", () => {
    return request(app)
      .post("/api/reviews")
      .send()
      .expect(400)
      .then((err) => {
        expect(err.body.message).toEqual("Invalid input provided");
      });
  });
  test("should respond with 400 if title is not a string", () => {
    return request(app)
      .post("/api/reviews")
      .send({
        owner: "bainesface",
        title: 49324,
        review_body: "Not bad.",
        designer: "Uwe Rosenberg",
        category: "euro game",
        review_img_url:
          "https://media.tenor.com/x8v1oNUOmg4AAAAd/rickroll-roll.gif",
      })
      .expect(400)
      .then((err) => {
        expect(err.body.message).toBe("Invalid input provided");
      });
  });
  test("should respond with 404 if owner is not found", () => {
    return request(app)
      .post("/api/reviews")
      .send({
        owner: "milhouse",
        title: "Agricola: It's alright",
        review_body: "Not bad.",
        designer: "Uwe Rosenberg",
        category: "euro game",
        review_img_url:
          "https://media.tenor.com/x8v1oNUOmg4AAAAd/rickroll-roll.gif",
      })
      .expect(404)
      .then((err) => {
        expect(err.body.message).toEqual("Owner not found");
      });
  });
  test("should default to chosen link if no image_url is provided", () => {
    return request(app)
      .post("/api/reviews")
      .send({
        owner: "bainesface",
        title: "Agricola: It's alright",
        review_body: "Not bad.",
        designer: "Uwe Rosenberg",
        category: "euro game",
      })
      .expect(201)
      .then((review) => {
        const reviewObj = review.body;
        expect(reviewObj).toBeInstanceOf(Object);
        expect(reviewObj.review.length).toBe(1);
        const expectedOutput = {
          owner: "bainesface",
          title: "Agricola: It's alright",
          review_body: "Not bad.",
          designer: "Uwe Rosenberg",
          category: "euro game",
          review_img_url:
            "https://media.tenor.com/x8v1oNUOmg4AAAAd/rickroll-roll.gif",
          review_id: 14,
          votes: 0,
          created_at: expect.any(String),
          comment_count: 0,
        };
        expect(reviewObj.review[0]).toMatchObject(expectedOutput);
      });
  });
});

describe("GET: /api/reviews/:review_id", () => {
  test("should respond with 200 code and array property containing correct single review object", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        const { review } = body;
        expect(review.length).toBe(1);
        const reviewTemplate = {
          review_id: 2,
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: expect.any(Number),
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
          comment_count: "3",
        };
        expect(review[0]).toMatchObject(reviewTemplate);
      });
  });
  test("should respond with 404 code if qeuried with valid but non-existent ID", () => {
    return request(app)
      .get("/api/reviews/234455")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Review ID not found");
      });
  });
  test("should respond with 400 code if qeuried with invalid ID", () => {
    return request(app)
      .get("/api/reviews/mushrooms")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Invalid ID provided");
      });
  });
});

describe("GET: /api/reviews/:review_id/comments", () => {
  test("should respond with 200 code and array property of multiple comment objects", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        const { comments } = body;
        const reviewTemplate = {
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          review_id: expect.any(Number),
        };
        comments.forEach((comment) =>
          expect(comment).toMatchObject(reviewTemplate)
        );
        expect(comments[0].review_id).toBe(2);
      });
  });
  test("should respond with 404 code if qeuried with valid but non-existent ID", () => {
    return request(app)
      .get("/api/reviews/234455/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Review ID not found");
      });
  });
  test("should respond with 400 code if qeuried with invalid ID", () => {
    return request(app)
      .get("/api/reviews/mushrooms/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Invalid ID provided");
      });
  });
  test("should respond with 200 code and an empty object if queried with valid ID but no comments exist", () => {
    return request(app)
      .get("/api/reviews/11/comments")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({ comments: [] });
      });
  });
});

describe("POST: /api/reviews/:review_id/comments", () => {
  test("should respond with 201 code and posted comment object", () => {
    return request(app)
      .post("/api/reviews/2/comments")
      .send({ username: "bainesface", body: "Not epic at all" })
      .expect(201)
      .then((response) => {
        const commentObj = response.body;
        expect(commentObj).toBeInstanceOf(Object);
        expect(commentObj).toHaveProperty("comment");
        expect(commentObj.comment.length).toBe(1);
        const expectedObj = {
          comment_id: expect.any(Number),
          body: expect.any(String),
          review_id: 2,
          author: "bainesface",
          votes: expect.any(Number),
          created_at: expect.any(String),
        };
        expect(commentObj.comment[0]).toMatchObject(expectedObj);
      });
  });
  test("should respond with 201 code and correct output if body has additional properties", () => {
    return request(app)
      .post("/api/reviews/2/comments")
      .send({
        username: "bainesface",
        body: "Not epic at all",
        height: 2000,
        faveColour: "grey",
      })
      .expect(201)
      .then((response) => {
        const commentObj = response.body;
        expect(commentObj).toBeInstanceOf(Object);
        expect(commentObj).toHaveProperty("comment");
        expect(commentObj.comment.length).toBe(1);
        const expectedObj = {
          comment_id: expect.any(Number),
          body: expect.any(String),
          review_id: 2,
          author: "bainesface",
          votes: expect.any(Number),
          created_at: expect.any(String),
        };
        expect(commentObj.comment[0]).toMatchObject(expectedObj);
      });
  });
  test("should respond with 400 code if body is missing required properties", () => {
    return request(app)
      .post("/api/reviews/2/comments")
      .send({ author: "pingu", review: "alright" })
      .expect(400)
      .then((err) => {
        expect(err.body.message).toBe("Invalid comment submitted");
      });
  });
  test("should respond with 404 code if review ID does not exist", () => {
    return request(app)
      .post("/api/reviews/4234234/comments")
      .send({ username: "bainesface", body: "Not epic at all" })
      .expect(404)
      .then((err) => {
        expect(err.body.message).toBe("Review ID not found");
      });
  });
  test("should respond with 400 code if review ID is invalid", () => {
    return request(app)
      .post("/api/reviews/mushrooms/comments")
      .send({ username: "bainesface", body: "Not epic at all" })
      .expect(400)
      .then((err) => {
        expect(err.body.message).toBe("Invalid ID provided");
      });
  });
  test("should respond with 404 code if username does not exist", () => {
    return request(app)
      .post("/api/reviews/2/comments")
      .send({ username: "ralphwiggum", body: "I'm learnding" })
      .expect(404)
      .then((err) => {
        expect(err.body.message).toBe(`User ID not found`);
      });
  });
});

describe("PATCH: /api/reviews/:review_id", () => {
  test("should respond with 200 code and the updated review object when passed a valid positive increment", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({ inc_votes: 4 })
      .expect(200)
      .then((review) => {
        const reviewObj = review.body;
        expect(reviewObj).toBeInstanceOf(Object);
        expect(reviewObj).toHaveProperty("review");
        expect(reviewObj.review.length).toBe(1);
        const expectedOutput = {
          review_id: 2,
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: expect.any(Number),
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
        };
        expect(reviewObj.review[0]).toMatchObject(expectedOutput);
        expect(reviewObj.review[0].votes).toBe(9);
      });
  });
  test("should decrement the votes when passed a negative increment", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({ inc_votes: -40 })
      .expect(200)
      .then((review) => {
        const reviewObj = review.body;
        expect(reviewObj).toBeInstanceOf(Object);
        expect(reviewObj).toHaveProperty("review");
        expect(reviewObj.review.length).toBe(1);
        const expectedOutput = {
          review_id: 2,
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: -35,
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
        };
        expect(reviewObj.review[0]).toMatchObject(expectedOutput);
      });
  });
  test("should respond with 200 code and expected output if given extra properties", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({ inc_votes: 4, faveTrick: "kickflip" })
      .expect(200)
      .then((review) => {
        const reviewObj = review.body;
        expect(reviewObj).toBeInstanceOf(Object);
        expect(reviewObj).toHaveProperty("review");
        expect(reviewObj.review.length).toBe(1);
        const expectedOutput = {
          review_id: 2,
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: expect.any(Number),
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
        };
        expect(reviewObj.review[0]).toMatchObject(expectedOutput);
        expect(reviewObj.review[0]).not.toHaveProperty("review");
      });
  });
  test("should respond with 400 code if inc_votes is not provided", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({ increase_by: 4 })
      .expect(400)
      .then((err) => {
        expect(err.body.message).toBe("Invalid request format");
      });
  });
  test("should respond with 404 code if review ID does not exist", () => {
    return request(app)
      .patch("/api/reviews/90023")
      .send({ inc_votes: 4 })
      .expect(404)
      .then((err) => {
        expect(err.body.message).toBe(`Review ID not found`);
      });
  });
  test("should respond with 400 code if review ID is invalid", () => {
    return request(app)
      .patch("/api/reviews/mushrooms")
      .send({ inc_votes: 4 })
      .expect(400)
      .then((err) => {
        expect(err.body.message).toBe(`Invalid ID provided`);
      });
  });
});

describe("PATCH: /api/comments/:comment_id", () => {
  test("should respond with 200 code and the updated comment object when passed a valid comment ID and increment", () => {
    return request(app)
      .patch("/api/comments/2")
      .send({ inc_votes: 2 })
      .expect(200)
      .then((comment) => {
        const commentObj = comment.body;
        expect(commentObj).toBeInstanceOf(Object);
        expect(commentObj).toHaveProperty("comment");
        expect(commentObj.comment.length).toBe(1);
        const expectedObj = {
          comment_id: 2,
          body: expect.any(String),
          review_id: expect.any(Number),
          author: "mallionaire",
          votes: 15,
          created_at: expect.any(String),
        };
        expect(commentObj.comment[0]).toMatchObject(expectedObj);
      });
  });
  test("should decrement the votes when passed a negative increment", () => {
    return request(app)
      .patch("/api/comments/2")
      .send({ inc_votes: -2 })
      .expect(200)
      .then((comment) => {
        const commentObj = comment.body;
        expect(commentObj).toBeInstanceOf(Object);
        expect(commentObj).toHaveProperty("comment");
        expect(commentObj.comment.length).toBe(1);
        const expectedOutput = {
          comment_id: 2,
          body: expect.any(String),
          review_id: expect.any(Number),
          author: "mallionaire",
          votes: 11,
          created_at: expect.any(String),
        };
        expect(commentObj.comment[0]).toMatchObject(expectedOutput);
      });
  });
  test("should respond with 200 code and expected output if given extra properties", () => {
    return request(app)
      .patch("/api/comments/2")
      .send({ inc_votes: 4, strength: 200 })
      .expect(200)
      .then((comment) => {
        const commentObj = comment.body;
        expect(commentObj).toBeInstanceOf(Object);
        expect(commentObj).toHaveProperty("comment");
        expect(commentObj.comment.length).toBe(1);
        const expectedOutput = {
          comment_id: 2,
          body: expect.any(String),
          review_id: expect.any(Number),
          author: "mallionaire",
          votes: 17,
          created_at: expect.any(String),
        };
        expect(commentObj.comment[0]).toMatchObject(expectedOutput);
      });
  });
  test("should respond with 400 code if inc_votes is not provided", () => {
    return request(app)
      .patch("/api/comments/2")
      .send({ multiply_by: 20000 })
      .expect(400)
      .then((err) => {
        expect(err.body.message).toBe("Invalid request format");
      });
  });
  test("should respond with 400 code if ID is invalid", () => {
    return request(app)
      .patch("/api/comments/blah")
      .send({ inc_votes: 4 })
      .expect(400)
      .then((err) => {
        expect(err.body.message).toBe("Invalid ID provided");
      });
  });
  test("should respond with 404 code if ID is not found", () => {
    return request(app)
      .patch("/api/comments/25566")
      .send({ inc_votes: 5 })
      .expect(404)
      .then((err) => {
        expect(err.body.message).toBe("Comment ID not found");
      });
  });
});

describe("DELETE: /api/comments/:comment_id", () => {
  test("should respond with 204 code (no content) and delete single comment by given ID", () => {
    return request(app)
      .delete("/api/comments/2")
      .expect(204)
      .then((response) => {
        expect(response.body).toEqual({});
      });
  });
  test("should respond with 404 code if queried with non-existent ID", () => {
    return request(app)
      .delete("/api/comments/80085")
      .expect(404)
      .then((err) => expect(err.body.message).toBe("Comment ID not found"));
  });
  test("should respond with 400 code if queried with invalid ID", () => {
    return request(app)
      .delete("/api/comments/mushrooms")
      .expect(400)
      .then((err) => expect(err.body.message).toBe("Invalid ID provided"));
  });
});
