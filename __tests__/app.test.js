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

beforeEach(() => seed({ categoryData, commentData, reviewData, userData }));
afterAll(() => db.end());

describe("Error Handling", () => {
  test("should respond with a 404 error if incorrect endpoint is specified", () => {
    return request(app)
      .get("/api/categorieeeees")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Path Not Found");
      });
  });
});

describe("GET: /api/users", () => {
  test("should respond with 200 and expected users object", () => {
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

describe("GET: /api/categories", () => {
  test("should respond with 200 status code and correctly formatted objects array", () => {
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
  test("should respond with a 200 status code, and correctly formatted/sorted objects array", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        const { reviews } = body;
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews.length).toBe(reviewData.length);
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
        reviews.forEach((review) => {
          expect(review).toMatchObject(reviewOutput);
        });
        expect(reviews).toBeSortedBy("created_at", { descending: true });
      });
  });
  test.only("should respond with expected object when queried with relevant category", () => {
    return request(app)
      .get("/api/reviews?category=social+deduction")
      .expect(200)
      .then((reviews) => {
        expect(reviews.body).toBeInstanceOf(Object);
        expect(reviews.body.reviews.length).toBe(11);
      });
  });
});

describe("GET: /api/reviews/:review_id", () => {
  test("should respond with array property containing correct single review object", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        const { review } = body;
        expect(review.length).toBe(1);
        const reviewTemplate = {
          review_id: expect.any(Number),
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: expect.any(Number),
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
        };
        expect(review[0]).toMatchObject(reviewTemplate);
        expect(review[0].review_id).toBe(2);
      });
  });
  test("should respond with 404 if qeuried with valid but non-existent ID", () => {
    return request(app)
      .get("/api/reviews/234455")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Review ID not found");
      });
  });
  test("should respond with 400 if qeuried with invalid ID", () => {
    return request(app)
      .get("/api/reviews/mushrooms")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Invalid ID provided");
      });
  });
});

describe("GET: /api/reviews/:review_id/comments", () => {
  test("should respond with array property of multiple comment objects", () => {
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
  test("should respond with 404 if qeuried with valid but non-existent ID", () => {
    return request(app)
      .get("/api/reviews/234455/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Sorry, review ID not found");
      });
  });
  test("should respond with 400 if qeuried with invalid ID", () => {
    return request(app)
      .get("/api/reviews/mushrooms/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Invalid ID provided");
      });
  });
  test("should respond with 200 and an empty object if queried with valid ID but no comments exist", () => {
    return request(app)
      .get("/api/reviews/11/comments")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({ comments: [] });
      });
  });
});

describe("POST: /api/reviews/:review_id/comments", () => {
  test("should respond with 201 and posted comment object", () => {
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
  test("should respond with 201 and correct output if body has additional properties", () => {
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
  test("should respond with 400 if body is missing required properties", () => {
    return request(app)
      .post("/api/reviews/2/comments")
      .send({ author: "pingu", review: "alright" })
      .expect(400)
      .then((err) => {
        expect(err.body.message).toBe("Invalid comment submitted");
      });
  });
  test("should respond with 404 if review ID does not exist", () => {
    return request(app)
      .post("/api/reviews/4234234/comments")
      .send({ username: "bainesface", body: "Not epic at all" })
      .expect(404)
      .then((err) => {
        expect(err.body.message).toBe("Sorry, review ID not found");
      });
  });
  test("should respond with 400 if review ID is invalid", () => {
    return request(app)
      .post("/api/reviews/mushrooms/comments")
      .send({ username: "bainesface", body: "Not epic at all" })
      .expect(400)
      .then((err) => {
        expect(err.body.message).toBe("Invalid ID provided");
      });
  });
  test("should respond with 404 if username does not exist", () => {
    return request(app)
      .post("/api/reviews/2/comments")
      .send({ username: "ralphwiggum", body: "I'm learnding" })
      .expect(404)
      .then((err) => {
        expect(err.body.message).toBe(`Sorry, user ID not found`);
      });
  });
});

describe("PATCH: /api/reviews/:review_id", () => {
  test("should return 200 and the updated review object when passed a valid positive increment", () => {
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
  test("should respond with 201 and expected output if given extra properties", () => {
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
  test("should respond with 400 if required property is missing", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({ increase_by: 4 })
      .expect(400)
      .then((err) => {
        expect(err.body.message).toBe("Invalid request format");
      });
  });
  test("should respond with 404 if review ID does not exist", () => {
    return request(app)
      .patch("/api/reviews/90023")
      .send({ inc_votes: 4 })
      .expect(404)
      .then((err) => {
        expect(err.body.message).toBe(`Sorry, review ID not found`);
      });
  });
  test("should respond with 400 if review ID is invalid", () => {
    return request(app)
      .patch("/api/reviews/mushrooms")
      .send({ inc_votes: 4 })
      .expect(400)
      .then((err) => {
        expect(err.body.message).toBe(`Invalid ID provided`);
      });
  });
});
