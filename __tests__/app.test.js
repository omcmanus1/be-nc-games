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
  test("GET: should respond with a 404 error if incorrect endpoint is specified", () => {
    return request(app)
      .get("/api/categorieeeees")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Path Not Found");
      });
  });
});

describe("/api/categories", () => {
  test("GET: should respond with 200 status code and correctly formatted objects array", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(categories).toBeInstanceOf(Object);
        expect(categories.rows).toBeInstanceOf(Array);
        expect(categories.rows.length).toBe(categoryData.length);
        categories.rows.forEach((category) => {
          expect(category).toHaveProperty("slug");
          expect(category).toHaveProperty("description");
        });
      });
  });
});

describe("/api/reviews", () => {
  test("GET: should respond with a 200 status code, and correctly formatted/sorted objects array", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeInstanceOf(Object);
        const reviewArray = reviews.rows;
        expect(reviewArray).toBeInstanceOf(Array);
        expect(reviewArray.length).toBe(reviewData.length);
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
        reviewArray.forEach((review) => {
          expect(review).toMatchObject(reviewOutput);
        });
        expect(reviewArray).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("/api/reviews/:id", () => {
  test("GET: should respond with an array containing correct single review object", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toBeInstanceOf(Object);
        const reviewArray = review.rows;
        expect(reviewArray.length).toBe(1);
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
        expect(reviewArray[0]).toMatchObject(reviewTemplate);
        expect(reviewArray[0].review_id).toBe(2);
      });
  });
  test("GET: should respond with 404 if qeuried with valid but non-existent ID", () => {
    return request(app)
      .get("/api/reviews/234455")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("ID not found");
      });
  });
  test("GET: should respond with 400 if qeuried with invalid ID", () => {
    return request(app)
      .get("/api/reviews/mushrooms")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid ID provided");
      });
  });
});
